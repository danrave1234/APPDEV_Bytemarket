import React, { useEffect, useState } from 'react';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/user/getAllUser')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching user data:', error));
    }, []);

    return (
        <div>
            <h1>User List</h1>
            <ul>
                {users.map(user => (
                    <li key={user.userid}>
                        <p>Username: {user.username}</p>
                        <p>Email: {user.email}</p>
                        <p>Full Name: {user.fullname}</p>
                        <p>Phone Number: {user.phonenumber}</p>
                        <p>Address: {user.address}</p>
                        <p>Date of Birth: {user.dateofbirth}</p>
                        <p>Balance: {user.balance}</p>
                        <p>Registration Date: {user.registration}</p>
                        <hr/>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default UserList;
