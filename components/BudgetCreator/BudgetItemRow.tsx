import React from "react";
import styled from "styled-components";

import { Color } from "../../styles";
import { EditableText } from "../../money-ui";
import { formatAmount } from "../../lib/currency";

const BudgetItemRow = ({
   budgetItem,
   isTotalRow,
   isOddNumberedRow,
   onUpdate,
}) => (
    <Container isOddNumberedRow={isOddNumberedRow}>
        <NameColumn isTotalRow={isTotalRow}>
            {isTotalRow ? (
                budgetItem.name
            ) : (
                <EditableText
                    value={budgetItem.name}
                    compact={true}
                    onChange={onUpdate("name")}
                />
            )}
        </NameColumn>

        <AmountColumn isTotalRow={isTotalRow}>
            {isTotalRow ? (
                formatAmount(budgetItem.amount / 12)
            ) : (
                <EditableText
                    type="money"
                    value={formatAmount(budgetItem.amount / 12)}
                    compact={true}
                    onChange={onUpdate("amount")}
                />
            )}
        </AmountColumn>
    </Container>
);

const Container = styled.div`
  width: 100%;
  display: flex;
  background-color: ${(props) => props.isOddNumberedRow ? Color.TitanWhite : Color.White};
  padding: 5px 10px;
`;

const NameColumn = styled.div`
  width: 45%;
  font-weight: ${(props) => props.isTotalRow ? 600 : 400};
  padding: ${(props) => props.isTotalRow && "2px 0 0 5px"}
`;

const AmountColumn = styled.div`
  font-weight: ${(props) => props.isTotalRow ? 600 : 400};
  padding: ${(props) => props.isTotalRow && "2px 0"}
`;

export default BudgetItemRow;
