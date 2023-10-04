import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import Footer from '../Footer'
import axios from 'axios';
import { useEffect } from 'react';

const Dashboard = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const getUsername = () => {
        if (window.localStorage.getItem('username')) {
            setUsername(window.localStorage.getItem('username'));
        } else {
            setUsername('')
        }
    }
    const [username, setUsername] = useState('');

    const [tasks, setTasks] = useState([]);

    const addTask = async (e) => {
        e.preventDefault();
        if (title.length === 0) {
            alert('Title cannont be blank')
            return
        }
        if (description.length === 0) {
            alert('Desription cannont be blank')
            return
        }
        let data = {
            title: title,
            description: description,
            userOnline: username
        }

        try {
            let res = await axios.post(`https://pgl.fhorge.co/api/task/new`, data);
            if (res.data.success) {
                alert('Task Added');
                getTasks();
            } else {
                alert('An error occured')
            }
        } catch (error) {
            // Handle errors
            alert('An error occured')
        }
    }

    const changeStatus = async (id, status) => {
        let data = {
            status: status,
            id: id,
        }
        try {
            let res = await axios.post(`https://pgl.fhorge.co/api/task/update`, data);
            if (res.data.success) {
                alert('Task Updated');
                getTasks();
            } else {
                alert('An error occured while updating task')
            }
        } catch (error) {
            // Handle errors
            alert('An error occured')
        }
    }

    const login = async (e) => {
        e.preventDefault();
        if (username.length === 0) {
            alert('Username cannont be blank')
            return
        }
        let data = {
            username: username
        }

        try {
            let res = await axios.post(`https://pgl.fhorge.co/api/sign-in`, data);
            if (res.data.success) {
                window.localStorage.setItem('username', username)
                getUsername();
            } else {
                alert('Unknown username')
            }
        } catch (error) {
            // Handle errors
            alert('An error occured')
        }
    }

    const getTasks = async () => {
        try {
            let res = await axios.get(`https://pgl.fhorge.co/api/tasks/${username}`,);
            setTasks(res.data);
        } catch (error) {
            // Handle errors
            setTasks([]);
        }
    }

    useEffect(() => {
        getUsername();

        setTimeout(() => {
            getTasks()
        }, 2500);

        return () => {
            getTasks();
        }
    }, [])


    return (
        <>
            <Helmet>
                <title>
                    Dashboard
                </title>
            </Helmet>

            <div className='container'>
                <div className='row justify-content-center'>
                    <div className='col-md-8 mt-4 p-3'>
                        <form className={(!window.localStorage.getItem('username')) ? 'col-md-12 p-5' : 'd-none'} onSubmit={e => login(e)} >


                            <div className="field">
                                <label className="label" htmlFor='username'>Username</label>
                                <div className="control">
                                    <input className="input" type="text" name='username' id="username" value={username} onChange={e => setUsername(e.target.value)} readonly placeholder="Your username" />
                                </div>
                            </div>

                            <div className="field is-grouped">
                                <div className="control">
                                    <button className="button is-link" type={'submit`'}>Sign In</button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className='col-md-8 mt-4 p-3'>
                        <form className={(window.localStorage.getItem('username')) ? 'col-md-12 p-5' : 'd-none'} onSubmit={e => addTask(e)}>
                            <div className="field">
                                <label className="label" htmlFor='title'>Title</label>
                                <div className="control">
                                    <input className="input" type="text" name='title' id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" />
                                </div>
                            </div>

                            <div className="field">
                                <label htmlFor='description' className="label">Description</label>
                                <div className="control">
                                    <textarea className="textarea" id="description" name='description' value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label" htmlFor='username'>Username</label>
                                <div className="control">
                                    <input className="input" type="text" name='username' id="username" value={username} readonly placeholder="Your username" />
                                </div>
                            </div>

                            <div className="field is-grouped">
                                <div className="control">
                                    <button className="button is-link" type={'submit`'}>Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className={tasks.length > 0 ? 'col-md-9' : 'd-none'}>
                        <table className="table table-responsive p-2 w-100">
                            <thead>
                                <tr>
                                    <th>S/N</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th>S/N</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                </tr>
                            </tfoot>
                            <tbody>
                                {tasks.map((task, index) => (
                                    <>
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{task.title}</td>
                                            <td>{task.description}</td>
                                            <td>{task.status}</td>
                                            <td className={task.status === "active" ? "" : "d-none"} >
                                                <button className='button is-success p-1 m-2'
                                                    onClick={(e) => {
                                                        changeStatus(task.id, 'completed')
                                                    }}
                                                >
                                                    ✔
                                                </button>
                                                <button className='button is-danger p-1 m-2'
                                                    onClick={(e) => {
                                                        changeStatus(task.id, 'cancelled')
                                                    }}>
                                                    ✖
                                                </button>
                                            </td>
                                            <td className={task.status !== "active" ? "" : "d-none"} >
                                                <button className='button is-success m-2' >&nbsp;</button>
                                            </td>
                                        </tr>
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard