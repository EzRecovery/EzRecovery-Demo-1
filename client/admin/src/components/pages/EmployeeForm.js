import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../manage employees/controls/Controls";
import { useForm, Form } from '../manage employees/useForm';
import * as employeeService from "../../services/employeeService";
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({

    newButton: {
        position: 'absolute',
        right: '520px',
        top: '406px'

    },
    newButton1: {
        position: 'absolute',
        right: '350px',
        top: '406px'
    }
}))


const initialFValues = {
    id: 0,
    name: '',
    username: '',
    password: '',
    address: '',
    contact_no: '',
    alternate_contact_no: '',
    email: '',
    departmentId: '',

}

export default function EmployeeForm(props) {
    const { addOrEdit } = props
    const classes = useStyles();
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required."
        if ('username' in fieldValues)
            temp.username = fieldValues.username ? "" : "This field is required."
        if ('password' in fieldValues)
            temp.password = fieldValues.password ? "" : "This field is required."
        if ('address' in fieldValues)
            temp.address = fieldValues.address ? "" : "This field is required."
        if ('email' in fieldValues)
            temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email is not valid."
        if ('contact_no' in fieldValues)
            temp.contact_no = fieldValues.contact_no.length > 9 ? "" : "Minimum 10 numbers required."
        if ('alternate_contact_no' in fieldValues)
            temp.alternate_contact_no = fieldValues.alternate_contact_no.length > 9 ? "" : "Minimum 10 numbers required."
        if ('departmentId' in fieldValues)
            temp.departmentId = fieldValues.departmentId.length != 0 ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            addOrEdit(values, resetForm);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={6}>
                    <Controls.Input
                        name="name"
                        label="Name"
                        value={values.name}
                        onChange={handleInputChange}
                        error={errors.name}
                    />
                    <Controls.Input
                        name="username"
                        label="Username"
                        value={values.username}
                        onChange={handleInputChange}
                        error={errors.username}
                    />
                    <Controls.Input
                        name="password"
                        label="Password"
                        type="password"
                        value={values.password}
                        onChange={handleInputChange}
                        error={errors.password}
                    />
                    <Controls.Input
                        name="address"
                        label="Address"
                        value={values.address}
                        onChange={handleInputChange}
                        error={errors.address}
                    />



                </Grid>
                <Grid item xs={6}>
                    <Controls.Input
                        label="Contact Number"
                        name="contact_no"
                        value={values.contact_no}
                        onChange={handleInputChange}
                        error={errors.contact_no}
                    />
                    <Controls.Input
                        label="Alternate Contact Number"
                        name="alternate_contact_no"
                        value={values.alternate_contact_no}
                        onChange={handleInputChange}
                        error={errors.alternate_contact_no}
                    />
                    <Controls.Input
                        label="Email"
                        name="email"
                        value={values.email}
                        onChange={handleInputChange}
                        error={errors.email}
                    />
                    <Controls.Select
                        name="departmentId"
                        label="Location Preference"
                        value={values.departmentId}
                        onChange={handleInputChange}
                        options={employeeService.getDepartmentCollection()}
                        error={errors.departmentId}
                    />


                    <div>
                        <Controls.Button className={classes.newButton}
                            type="submit"
                            text="Submit" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Controls.Button className={classes.newButton1}
                            text="Reset"
                            color="default"
                            onClick={resetForm} />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}
