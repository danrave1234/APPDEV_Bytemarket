import React, { useState } from 'react';

const UserForm = () => {
    const [user, setUser] = useState({
        username: '',
        password: '',
        email: '',
        fullname: '',
        phonenumber: '',
        address: '',
        dateofbirth: '',
        balance: 0.0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/user/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            const addedUser = await response.json();
            console.log('User added:', addedUser);
            // Optionally, you can reset the form or show a success message
            setUser({
                username: '',
                password: '',
                email: '',
                fullname: '',
                phonenumber: '',
                address: '',
                dateofbirth: '',
                balance: 0.0,
                registration: new Date().toISOString().split('T')[0],
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Add User</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={user.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="fullname"
                    placeholder="Full Name"
                    value={user.fullname}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phonenumber"
                    placeholder="Phone Number"
                    value={user.phonenumber}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={user.address}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="dateofbirth"
                    placeholder="Date of Birth"
                    value={user.dateofbirth}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="balance"
                    placeholder="Balance"
                    value={user.balance}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Add User</button>
            </form>
        </div>
    );
};

export default UserForm;
