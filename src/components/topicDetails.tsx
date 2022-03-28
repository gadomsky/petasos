import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import {Backdrop, Button, CircularProgress} from "@mui/material";
import {useObserver} from "mobx-react-lite";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {TopicInfo} from "../propertiesInfo";
import {useStore} from "../store/storeProvider";
import styles from "../styles/details.css";
import layout from "../styles/layout.css";
import {
    createRow,
    PropertiesTable,
    PropertiesTableRow
} from "./propertiesTable";
import {StyledPaper} from "./styledMuiComponents";
import {SubscriptionListElement} from "./subscriptionListElement";
import {TopicFrontendUrl} from "./topicFrontendUrl";

export const TopicDetails = () => {
    const {topics, dialogs} = useStore();

    return useObserver(() => {
        const [showAdvanced, setShowAdvanced] = useState(false)
        useEffect(() => {
            const fetchData = async () => {
                topics.selectedTopic && await topics.selectedTopic.fetchTask();
                await topics.selectedTopic.fetchMessagePreviewTask();
            }
            fetchData()
        }, [topics.selectedTopic])

        const timeFormat = 'dddd, MMMM Do, YYYY h:mm:ss A'

        const properties: PropertiesTableRow[] = [
            createRow("Description", topics.selectedTopic.description),
            createRow("Creation date", moment.unix(topics.selectedTopic.createdAt).format(timeFormat)),
            createRow("Modification date", moment.unix(topics.selectedTopic.modifiedAt).format(timeFormat))
        ]

        const advancedProperties: PropertiesTableRow[] = [
            createRow("Acknowledgement", topics.selectedTopic.ack, TopicInfo.ack),
            createRow("Retention time", `${topics.selectedTopic.retentionTime.duration} days`, TopicInfo.retentionTime.duration),
            createRow("Tracking enabled", `${topics.selectedTopic.trackingEnabled}`),
            createRow("Max message size", `${topics.selectedTopic.maxMessageSize}`)
        ]

        return (
            <div>
                <Backdrop open={topics.selectedTopic.fetchTask.pending} style={{color: '#fff', zIndex: 1}}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
                {topics.selectedTopic &&
                <>
                    <div className={styles.DetailsHeader}>
                        <div className={layout.Row}>
                            <div className={layout.Column}>
                                <div className={styles.DetailsHeaderSubtitle}>topic</div>
                                <div className={styles.DetailsHeaderTitle}>{topics.selectedTopic.name}</div>
                                <TopicFrontendUrl topic={topics.selectedTopic.name}/>
                            </div>
                            <div className={layout.ColumnAlignRight}>
                                <Button variant={"contained"} color={"primary"} startIcon={<EditIcon/>}
                                        onClick={() => dialogs.editTopic.setOpen(true)}>Edit</Button>
                                {" "}<Button variant={"contained"} color={"primary"} startIcon={<FileCopyIcon/>}
                                             onClick={() => dialogs.addClonedTopic.setOpen(true)}>Clone</Button>
                                {" "}<Button variant={"contained"} color={"primary"} startIcon={<DeleteIcon/>}
                                             onClick={() => dialogs.deleteTopicDialog.setOpen(true)}>Remove</Button>
                            </div>
                        </div>
                    </div>
                    {topics.selectedTopic.fetchTask.resolved &&
                    <>
                        <div className={layout.Row}>
                            <div className={layout.Column}>
                                <div className={styles.DetailsBox}>
                                    <div className={styles.DetailsBoxHeader}>Properties</div>
                                    {showAdvanced ?
                                        <PropertiesTable properties={properties.concat(advancedProperties)}/>
                                        : <PropertiesTable properties={properties}/>}
                                    <Button size="small" color={"primary"}
                                            onClick={() => setShowAdvanced(!showAdvanced)}>
                                        {showAdvanced ? "Hide advanced" : "Show advanced"}
                                    </Button>
                                </div>
                                <div className={styles.DetailsBox}>
                                    <div className={styles.DetailsBoxHeader}>Subscriptions
                                        {" "}<Button color="secondary" variant="contained" startIcon={<AddIcon/>} size="small"
                                                     onClick={() => dialogs.subscription.setOpen(true)}>Add
                                            subscription</Button></div>
                                    {topics.selectedTopic.subscriptionsMap.size > 0 ?
                                        Array.from(topics.selectedTopic.subscriptionsMap).map(([name, sub]) =>
                                            <SubscriptionListElement key={name} subscription={sub}/>
                                        ) : <div className={layout.p}>No subscriptions yet</div>}
                                </div>
                            </div>
                            <div className={layout.Column}>
                                <div className={styles.DetailsBox}>
                                    <div className={styles.DetailsBoxHeader}>Message schema</div>
                                    <StyledPaper style={{padding: '10px'}}>
                                        {topics.selectedTopic.contentType !== "AVRO" ?
                                            <div className={layout.p}>Not an AVRO schema</div> :
                                            <pre>{topics.selectedTopic.schemaWithoutMetadata}</pre>
                                        }
                                    </StyledPaper>
                                </div>
                                <div className={styles.DetailsBox}>
                                    <div className={styles.DetailsBoxHeader}>Message preview</div>
                                    {topics.selectedTopic.fetchMessagePreviewTask.pending ?
                                        <CircularProgress/> :
                                        <>
                                            {topics.selectedTopic.messagePreview.length === 0 ?
                                                <div className={layout.p}>There are no messages available.</div> :
                                                <StyledPaper style={{padding: '10px'}}>
                                                    <div>{topics.selectedTopic.filteredMessagePreview.map((msg, i) =>
                                                        <pre key={i}>{msg}</pre>)}
                                                    </div>
                                                </StyledPaper>
                                            }
                                        </>}
                                </div>
                            </div>
                        </div>
                    </>}
                </>
                }
            </div>
        )
    })
}
