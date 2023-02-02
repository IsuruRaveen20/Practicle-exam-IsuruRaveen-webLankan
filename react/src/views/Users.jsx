import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchEmail, setSearchEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext()

    useEffect(() => {
        getUsers();
    }, [])

    //Handle Filter by email
    const handleFilter = (e) => {
        setSearchEmail(e.target.value);
        setFilteredUsers(
            users.filter((user) =>
                user.email.toLowerCase().includes(e.target.value.toLowerCase())
            )
        );
    };

    //Delete User
    const onDeleteClick = user => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return
        }
        axiosClient.delete(`/users/${user.id}`)
            .then(() => {
                setNotification('User was successfully deleted')
                getUsers()
            })
    }

    //Get All Users
    const getUsers = () => {
        setLoading(true)
        axiosClient.get('/users')
            .then(({ data }) => {
                setLoading(false)
                setUsers(data.data)
                console.log(data);
            })
            .catch(() => {
                setLoading(false)
            })
    }
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                <h1>Users</h1>
                <Link className="btn-add" to="/users/new">Add new</Link>
            </div>
            <div className='emailText'>Enter Email to search</div>
            <input
                type="text"
                placeholder="Filter by email"
                value={searchEmail}
                onChange={handleFilter}
                className='search'
            />
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact No</th>
                            <th>Address</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {/* If searchEmail is null it will fetch all users otherwise it will filter users according to given email */}
                    {
                        searchEmail == '' ? !loading &&
                            <tbody>
                                {users.map(usr => (
                                    <tr key={usr.id}>
                                        <td>{usr.id}</td>
                                        <td>{usr.name}</td>
                                        <td>{usr.email}</td>
                                        <td>{usr.contact}</td>
                                        <td>{usr.address}</td>
                                        <td>{usr.created_at}</td>
                                        <td>
                                            <Link className="btn-edit" to={'/users/' + usr.id}>Edit</Link>
                                            &nbsp;
                                            <button className="btn-delete" onClick={ev => onDeleteClick(usr)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            : !loading &&
                            <tbody>
                                {filteredUsers.map(usr => (
                                    <tr key={usr.id}>
                                        <td>{usr.id}</td>
                                        <td>{usr.name}</td>
                                        <td>{usr.email}</td>
                                        <td>{usr.contact}</td>
                                        <td>{usr.address}</td>
                                        <td>{usr.created_at}</td>
                                        <td>
                                            <Link className="btn-edit" to={'/users/' + usr.id}>Edit</Link>
                                            &nbsp;
                                            <button className="btn-delete" onClick={ev => onDeleteClick(usr)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                    }

                    {loading &&
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    }

                </table>
            </div>
        </div>
    )
}
