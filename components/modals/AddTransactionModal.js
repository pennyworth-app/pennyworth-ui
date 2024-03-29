import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import moment from "moment";

import LoadingSpinner from "../../money-ui/LoadingSpinner";

const GET_BUDGETS_QUERY = gql`
    query GetBudgets {
        getBudgets {
            id
            name
        }
    }
`;

const ADD_TRANSACTION_MUTATION = gql`
    mutation CreateTransaction($transaction: TransactionInput!) {
        createTransaction(transaction: $transaction) {
            id
        }
    }
`;

const REFETCH_QUERIES = gql`
    query RefetchQueries(
        $from7: String!, 
        $from14: String!, 
        $from30: String!,
        
        $perDayFrom: String!,
        $perDayTo: String!,
    ) {
        spendingIn7: getAmountSpent(from: $from7)
        spendingIn14: getAmountSpent(from: $from14)
        spendingIn30: getAmountSpent(from: $from30)
        getTransactions {
            id
            transactionTime
            amount
            transactee
            description
        }
        getAmountSpentPerDay(from: $perDayFrom, to: $perDayTo)
    }
`;

const AddTransactionModal = ({ visible, handleClose }) => {
    if (!visible) { return null; }

    const [transactionTime, setTransactionTime] = useState(moment().format("YYYY-MM-DDTHH:mm"));
    const [amount, setAmount] = useState("");
    const [transactee, setTransactee] = useState("");
    const [description, setDescription] = useState("");
    const [budgetId, setBudgetId] = useState(null);

    const {loading, error, data} = useQuery(GET_BUDGETS_QUERY);

    const sevenDaysAgo = moment().subtract(6, "days").startOf("day").valueOf().toString();
    const fourteenDaysAgo = moment().subtract(13, "days").startOf("day").valueOf().toString();
    const thirtyDaysAgo = moment().subtract(29, "days").startOf("day").valueOf().toString();

    const perDayFrom = moment().subtract(20, "days").startOf("day").valueOf().toString();
    const perDayTo = moment().startOf("day").valueOf().toString();

    const [updateUser] = useMutation(ADD_TRANSACTION_MUTATION, {
        refetchQueries: [{
            query: REFETCH_QUERIES,
            variables: {
                from5: sevenDaysAgo,
                from10: fourteenDaysAgo,
                from20: thirtyDaysAgo,
                perDayFrom,
                perDayTo,
            },
        }],
        onCompleted() {
            setTransactionTime(moment().format("YYYY-MM-DDTHH:mm"));
            setAmount("");
            setTransactee("");
            setDescription("");
            setBudgetId(null);
            handleClose();
        },
        onError(error) {
            if (error) {
                console.error(error);
            }
        },
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        await updateUser({
            variables: {
                transaction: {
                    transactionTime: moment(transactionTime).valueOf().toString(),
                    amount: parseFloat(amount),
                    transactee,
                    description,
                    budgetId,
                },
            },
        });
    };

    if (error) {
        alert("We are experiencing a problem");
        return;
    }

    if (loading) {
        return (
            <div className="modal-background">
                <section className="modal-main">
                    <LoadingSpinner/>
                </section>
            </div>
        );
    }

    const budgets = data.getBudgets;

    return (
        <div className="modal-background">
            <section className="modal-main">
                <h2>New transaction</h2>
                <form>
                    <h4>Required</h4>

                    <input
                        placeholder="Time"
                        type="datetime-local"
                        value={transactionTime}
                        onChange={(event) => { setTransactionTime(event.target.value); }}
                    />

                    <input
                        placeholder="Amount"
                        type="number"
                        value={amount}
                        onChange={(event) => { setAmount(event.target.value); }}
                    />

                    <input
                        placeholder="Transactee"
                        type="text"
                        value={transactee}
                        onChange={(event) => { setTransactee(event.target.value); }}
                    />

                    <input
                        placeholder="Description"
                        type="text"
                        value={description}
                        onChange={(event) => { setDescription(event.target.value); }}
                    />

                    <h4>Optional</h4>

                    <select onChange={(event) => { setBudgetId(event.target.value); }}>
                        <option key="null" value={null}>
                            -- Select a budget --
                        </option>
                        {budgets.map((budget) => (
                            <option key={budget.id} value={budget.id}>
                                {budget.name}
                            </option>
                        ))}
                    </select>

                    <button
                        disabled={false}
                        onClick={handleSubmit}
                    >
                        Add transaction
                    </button>

                    <button
                        disabled={false}
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                </form>
            </section>
        </div>
    );
};

export default AddTransactionModal;
