import React, { useState, useEffect, Children } from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import Axios from 'axios';
import ReactTooltip from 'react-tooltip'
import './addLeave.css'
import TextField from '@material-ui/core/TextField'
import { Button } from '@material-ui/core';

function AddLeave() {

    const [leaves, setLeaves] = useState([])
    const [title, setTitle] = useState('')

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')


    const [calendarState, setCalendarState] = useState(false)

    const insertLeaves = () => {
        Axios.post('http://localhost:3001/insertLeaves', {
            start: startDate,
            end: endDate,
            id: 1,
        }).then(res => setCalendarState(prevState => {
            if (prevState === false)
                return true
            return false
        }))
    }

    useEffect(() => {

        Axios.post('http://localhost:3001/getLeaves', {
            id: 1,
        })
            .then(res => {
                let value = []
                res.data.data.map((val) => {

                    let start = new Date(val.start_date)
                    let startDate = (start.getDate() < 10) ? `0${(start.getDate())}` : `${(start.getDate())}`
                    let startMonth = (start.getMonth() < 10) ? `0${(start.getMonth() + 1)}` : `${(start.getMonth() + 1)}`
                    let SDate = start.getFullYear() + '-' + startMonth + '-' + startDate;

                    let end = new Date(val.end_date)
                    let endDate = (end.getDate() < 10) ? `0${(end.getDate() + 1)}` : `${(end.getDate() + 1)}`
                    let endMonth = (end.getMonth() < 10) ? `0${(end.getMonth() + 1)}` : `${(end.getMonth() + 1)}`
                    let EDate = end.getFullYear() + '-' + endMonth + '-' + endDate;


                    let value1 = {
                        start: SDate,
                        end: EDate,
                        backgroundColor: 'blue',
                        display: 'background',

                    }
                    value.push(value1)

                })
                setLeaves(value)
            })
            .catch(rej => console.log(rej))
    }, [calendarState])


    const hover = (info) => {
        info.el.setAttribute("data-tip", "ON LEAVE")
        ReactTooltip.rebuild();
    }

    return (
        <div className="addLeaveContainer">
            <div className="addLeave">
                <FullCalendar
                    height={500}
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    weekends={true}
                    headerToolbar={{
                        left: 'prev,next,today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={leaves}
                    eventContent={() => {
                        return (
                            <ReactTooltip place="bottom" effect="float" backgroundColor="orange" textColor="black" >
                            </ReactTooltip>
                        );
                    }}
                    eventMouseEnter={hover}
                />
                {/* <br /><br /><br /> */}
                <TextField
                    id="date"
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="date"
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button onClick={insertLeaves}> Submit Here</Button>
            </div>
        </div>
    )
}

export default AddLeave









// class CalendarLeaves extends React.Component {


//     state = {
//         weekendsVisible: true,
//         currentEvents: []
//     }
//     // componentDidMount() {
//     //     this.handleDateSelect()
//     // }


//     render() {
//         return (
//             <div className='calendar'>
//                 <FullCalendar
//                     //height={650}
//                     plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//                     headerToolbar={{
//                         left: 'prev,next,today',
//                         center: 'title',
//                         right: 'dayGridMonth,timeGridWeek,timeGridDay'
//                     }}
//                     initialView='dayGridMonth'
//                     editable={true}
//                     selectable={true}
//                     selectMirror={true}
//                     dayMaxEvents={true}
//                     weekends={this.state.weekendsVisible}
//                     initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
//                     select={this.handleDateSelect}
//                     eventChange={this.handleDateSelect}
//                     eventContent={() => {
//                         return (
//                             <ReactTooltip place="bottom" effect="float" backgroundColor="black" textColor="white" >
//                             </ReactTooltip>
//                         );
//                     }}
//                     eventMouseEnter={this.hover}
//                     eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
//                     weekends={false}
//                 />
//             </div>
//         )
//     }

//     hover(info) {
//         //console.log(events)
//         info.el.setAttribute("data-tip", "ON LEAVE")
//         ReactTooltip.rebuild();
//     }

//     handleDateSelect = (selectInfo) => {
//         //console.log("Anish")
//         Axios.post("http://localhost:3001/getLeaves", {
//             eno: 1,
//         }).then(response => {
//             var res = response.data;
//             res.map((value) => {
//                 var title = value.emp_name;
//                 var start = value.start_date;
//                 var end = value.end_date;
//                 var t = new Date(end);
//                 t.setDate(t.getDate() + 1);
//                 let calendarApi = selectInfo.view.calendar
//                 if (res) {
//                     calendarApi.addEvent({
//                         title: title,
//                         start: start,
//                         end: t,
//                         backgroundColor: "blue",
//                         display: "background",
//                         allDay: selectInfo.allDay
//                     })
//                 }
//             })

//         })

//     }
//     handleEvents = (events) => {
//         this.setState({
//             currentEvents: events
//         })
//     }

// }



// export default CalendarLeaves;


// import React from 'react'
// import FullCalendar, { formatDate } from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from '@fullcalendar/interaction'
// import Axios from 'axios';
// import ReactTooltip from 'react-tooltip'
// import './calender.css'

// class CalendarLeaves extends React.Component {
//     state = {
//         count: 0,
//     }

//     render() {
//         return (
//             <div className='calendar'>
//                 <FullCalendar
//                     plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//                     headerToolbar={{
//                         left: 'prev,next,today',
//                         center: 'title',
//                         right: 'dayGridMonth,timeGridWeek,timeGridDay'
//                     }}
//                     events={this.state.data}
//                     initialView='dayGridMonth'
//                     editable={true}
//                     selectMirror={true}
//                     select={this.handleDateSelect}
//                     eventContent={() => {
//                         return (
//                             <ReactTooltip place="bottom" effect="float" backgroundColor="black" textColor="white" >
//                             </ReactTooltip>
//                         );
//                     }}
//                     eventMouseEnter={this.hover}
//                     weekends={false}
//                     events={this.state.data}
//                 />
//             </div>
//         )
//     }


//     componentDidMount() {
//         this.handleDateSelect()
//     }

//     componentDidUpdate(prevState) {
//         // if (this.state.count != prevState.count) {
//         // this.handleDateSelect()
//         console.log(prevState.count)
//         console.log("Update")
//     }

//     hover(info) {
//         info.el.setAttribute("data-tip", "YOU ARE ON LEAVE HERE!")
//         ReactTooltip.rebuild();
//     }

//     handleDateSelect = () => {
//         console.log(this.state.count)
//         var array;
//         Axios.post("http://localhost:3001/getLeaves", {
//             eno: 1,
//         }).then(response => {

//             if (this.state.count == 0)
//                 array = []
//             else
//                 array = this.state.data

//             var res = response.data;

//             res.map((value) => {
//                 var title = value.emp_name;
//                 var start = value.start_date;

//                 var end = value.end_date;
//                 var t = new Date(end);
//                 t.setDate(t.getDate() + 1);
//                 console.log(end)
//                 array.push({ title: title, start: start, end: t, backgroundColor: "blue", display: "background" })
//             })
//             this.setState({
//                 data: array,
//                 count: this.state.count + 1,
//             })
//         })

//     }

// }
// export default CalendarLeaves;