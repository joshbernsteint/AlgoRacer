import { useState, useEffect } from 'react';
import axios from 'axios'
import { OverlayTrigger, Popover, ButtonGroup, ToggleButton, Button } from 'react-bootstrap'
import styles from './Leaderboard.module.css'


/**
 * Converts a UNIX timestamp into a human-readable date
 * @param {Number} timestamp UNIX timestamp of the time to be converted
 * @returns A string corresponding to the date of the timestamp in the form `YYYY-MM-DD HH:MM:SS`
 */
function timestampToDate(timestamp) {
    if (typeof timestamp !== "number" || isNaN(timestamp)) throw "timestampToDate: Timestamp must exist and be a number";

    let temp_date = new Date(timestamp);
    //Ensuring that numbers are always of length 2
    const month = ((temp_date.getMonth() + 1).toString()).padStart(2, "0");
    const date = (temp_date.getDate().toString()).padStart(2, "0");
    const hours = (temp_date.getHours().toString()).padStart(2, "0");
    const minutes = (temp_date.getMinutes().toString()).padStart(2, "0");
    const seconds = (temp_date.getSeconds().toString()).padStart(2, "0");

    return `${temp_date.getFullYear()}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

function timeToString(time) {
    const seconds = String(time % 60);
    let minutes = Math.floor(time / 60);
    const hours = String(Math.floor(minutes / 60));
    minutes = String(minutes % 60);
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
}


function filterLeaderboard(boards, boardName, curDiff) {
    const board = [];
    const curlb = boards.filter(el => el.name === boardName)[0];
    if (curDiff === "All") {
        board.push(...curlb.Beginner.map(run => {
            return { ...run, diff: "Beginner" }
        }));
        board.push(...curlb.Normal.map(run => {
            return { ...run, diff: "Normal" }
        }));
        board.push(...curlb.Insane.map(run => {
            return { ...run, diff: "Insane" }
        }));
    }
    else {
        board.push(...curlb[curDiff].map(run => {
            return { ...run, diff: curDiff }
        }));
    }
    board.sort((x, y) => { return (x.score === y.score) ? (x.time - y.time) : (y.score - x.score) });
    return [board, curlb];
}

function Leaderboard(props) {
    const userData = props.userData;
    const leaderBoardOptions = ["Bubble Sort", "Selection Sort", "Insertion Sort"];
    const difficulties = ["All", "Beginner", "Normal", "Insane"];


    const [leaderboardType, setLeaderboardType] = useState(leaderBoardOptions[0]);
    const [difficultyFilter, setDifficultyFilter] = useState(difficulties[0]);
    const [fullLeaderboard, setFullLeaderboard] = useState(null);
    const [currentLeaderboard, setCurrentLeaderboard] = useState(undefined);

    useEffect(() => {
        async function getLeaderboardData() {
            const { data } = await axios.get("https://algoracer-backend-5bed1a87253c.herokuapp.com/leaderboard");
            const [x, y] = filterLeaderboard(data, leaderboardType, difficultyFilter);
            setCurrentLeaderboard(x);
            setFullLeaderboard(data);
        }
        getLeaderboardData();
    }, []);

    useEffect(() => {
        if (currentLeaderboard) {
            const res = filterLeaderboard(fullLeaderboard, leaderboardType, difficultyFilter)[0];
            setCurrentLeaderboard(filterLeaderboard(fullLeaderboard, leaderboardType, difficultyFilter)[0]);
        }
    }, [difficultyFilter, leaderboardType])


    function LeaderboardElement({ displayName, score, time, date, diff, ...props }) {
        const stringDate = timestampToDate(date);
        const diffTextColor = (diff === "Beginner") ? ("green") : ((diff === "Normal") ? ("black") : "darkred");

        return (
            <>
                <tr className={styles.element}>
                    <td className={styles.name}>
                        {displayName}</td>
                    <td className={styles.date}>{stringDate}</td>
                    <td className={styles.time}>{timeToString(time)}</td>
                    <td className={styles.date}><span style={{ color: diffTextColor }}>{diff}</span></td>
                    <td className={styles.score}>{score}</td>
                </tr>
                <tr className={styles.blank}><td colSpan={5}></td></tr>
            </>
        );
    }




    return (

        <div id={styles.main}>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <h2 id={styles.leaderboard_header}>
                <OverlayTrigger trigger={'click'} placement='top' overlay={
                    <Popover>
                        <Popover.Body>
                            <ButtonGroup>
                                {
                                    leaderBoardOptions.map((el, i) => (
                                        <ToggleButton key={i}
                                            type='radio'
                                            variant='outline-info'
                                            checked={el === leaderboardType}
                                            name='radio2'
                                            onClick={(e) => {
                                                setLeaderboardType(e.currentTarget.innerHTML);
                                            }}
                                        >
                                            {el}
                                        </ToggleButton>
                                    ))
                                }
                            </ButtonGroup>
                        </Popover.Body>
                    </Popover>
                }>
                    <button style={{ color: "var(--color-btn)", border: ".1rem solid var(--color-btn)", borderRadius: "5px", padding: ".25rem", background: "transparent", marginRight: "20px" }}>{leaderboardType}</button>
                </OverlayTrigger>
                Leaderboard
            </h2>
            {
                (fullLeaderboard) ? (
                    <table id={styles.leaderboard} cellSpacing={0}>
                        <thead style={{ textAlign: "center" }}>

                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>{difficultyFilter}
                                    <OverlayTrigger trigger={["click"]} placement='top' overlay={
                                        <Popover style={{ minWidth: "fit-content" }}>
                                            <Popover.Body>
                                                <ButtonGroup>
                                                    {
                                                        difficulties.map((el, i) => {
                                                            return (
                                                                <ToggleButton
                                                                    key={i}
                                                                    type='radio'
                                                                    variant={'outline-primary'}
                                                                    value={el}
                                                                    name='radio'
                                                                    checked={difficultyFilter === el}
                                                                    onClick={(e) => {
                                                                        setDifficultyFilter(e.currentTarget.innerHTML)
                                                                    }}
                                                                >
                                                                    {el}
                                                                </ToggleButton>
                                                            )
                                                        })
                                                    }
                                                </ButtonGroup>
                                            </Popover.Body>
                                        </Popover>
                                    }>
                                        <button id={styles.filterButton}><img src="./filter.png" alt="filter" width={"15px"} height={"15px"} /></button>
                                    </OverlayTrigger>
                                </th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentLeaderboard.map((el, i) => (
                                    <LeaderboardElement displayName={el.displayName} score={el.score} time={el.time_taken} date={el.timestamp} diff={el.diff} key={i} />
                                ))
                            }
                        </tbody>
                    </table>
                ) : (<></>)
            }
        </div>
    );
}

export default Leaderboard;