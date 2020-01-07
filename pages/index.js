import React, {useState} from "react";
import PropTypes from "prop-types";

import {withApollo} from "../lib/apollo";
import redirect from "../lib/redirect";
import checkLoggedIn from "../lib/checkLoggedIn";
import AuthenticatedPage from "../components/AuthenticatedPage";
import SetGoalModal from "../components/modals/SetGoalModal";
import AddTransactionModal from "../components/modals/AddTransactionModal";
import GoalProgress from "../components/GoalProgress";
import SpendingPerDay from "../components/SpendingPerDay";
import TransactionsTable from "../components/TransactionsTable";

const IndexPage = ({loggedInUser}) => {
    const [showTransactionModal, setShowTransactionModal] = useState(false);

    return (
        <AuthenticatedPage>
            <SetGoalModal visible={!loggedInUser.monthlySpendingGoal}/>
            <AddTransactionModal
                visible={showTransactionModal}
                handleClose={() => { setShowTransactionModal(false); }}
            />

            <div className="main-view">
                <div className="main-column">
                    <GoalProgress monthlySpendingGoal={loggedInUser.monthlySpendingGoal}/>
                </div>

                <div className="main-column">
                    {/*<SpendingPerDay monthlySpendingGoal={loggedInUser.monthlySpendingGoal}/>*/}
                    <TransactionsTable handleAddTransactionClick={() => { setShowTransactionModal(true); }}/>
                </div>

            </div>
        </AuthenticatedPage>
    );
};

IndexPage.getInitialProps = async (context) => {
    const {loggedInUser} = await checkLoggedIn(context.apolloClient);

    if (!loggedInUser.token) {
        redirect(context, "/login");
    }

    return {loggedInUser};
};

IndexPage.propTypes = {
    loggedInUser: PropTypes.shape({
        id: PropTypes.string.isRequired,
        token: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        monthlySpendingGoal: PropTypes.number,
    }).isRequired,
};

export default withApollo(IndexPage);
