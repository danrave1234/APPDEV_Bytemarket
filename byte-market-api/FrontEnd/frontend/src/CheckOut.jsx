import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";
import { useEffect, useState } from 'react';

function CheckOut() {
    const { userid } = useAuth();
    const [transactions, setTransactions] = useState([]);

    // Fetch transactions for the logged-in user
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Replace with actual API endpoint to fetch transactions
                const response = await fetch(`/api/transactions?userid=${userid}`);
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, [userid]);

    return (
        <>
            <PageLayout>
                <div className="container">
                    <h2>My E-Wallet Transactions</h2>
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <tr key={transaction.TransactionID}>
                                        <td>{transaction.TransactionID}</td>
                                        <td>{new Date(transaction.TransactionDate).toLocaleDateString()}</td>
                                        <td>{transaction.Amount}</td>
                                        <td>{transaction.TransactionType}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="no-transactions">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </PageLayout>

            {/* Inline CSS */}
            <style jsx>{`
                .container {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                h2 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 20px;
                }

                .transaction-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .transaction-table th, .transaction-table td {
                    padding: 12px;
                    border: 1px solid #ddd;
                    text-align: left;
                }

                .transaction-table th {
                    background-color: #f4f4f4;
                    font-weight: bold;
                }

                .transaction-table tr:nth-child(even) {
                    background-color: #f9f9f9;
                }

                .no-transactions {
                    text-align: center;
                    color: #888;
                    padding: 20px;
                }
            `}</style>
        </>
    );
}

export default CheckOut;
