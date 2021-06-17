import React from 'react';
import { Card, CardContent, Typography} from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({title , cases, active, isRed, total, ...props}) {
    return (
        <Card className={`InfoBox ${active && 'InfoBox--selected'} ${isRed && 'InfoBox--red'}`} onClick={props.onClick} active>
            <CardContent>
                {/* title */}
                <Typography className="infoBox_title" color="textSecondary">
                    {title}
                </Typography>
                {/* No. of Cases  */}
                <h2 className={`infoBox_cases ${!isRed && 'infoBox_cases--green'}`}>{cases}</h2>
                {/* total cases  */}
                <Typography className="infoBox_total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;
