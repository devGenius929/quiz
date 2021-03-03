import React, { useState, useEffect } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ArrowForwardSharp from "@material-ui/icons/ArrowForwardSharp";
import ArrowBackSharp from "@material-ui/icons/ArrowBackSharp";
import {
  createMuiTheme,
  withStyles,
  makeStyles,
  ThemeProvider
} from "@material-ui/core/styles";
import { green, purple } from "@material-ui/core/colors";
import db from "./firebase";
import { DataGrid } from "@material-ui/data-grid";
import moment from "moment";
import { storage } from "./firebase";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";

import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

const BootstrapButton = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    padding: "6px 12px",
    border: "1px solid",
    lineHeight: 1.5,
    backgroundColor: "#0063cc",
    borderColor: "#0063cc",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:hover": {
      backgroundColor: "#0069d9",
      borderColor: "#0062cc",
      boxShadow: "none"
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#0062cc",
      borderColor: "#005cbf"
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)"
    }
  }
})(Button);

const ColorButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700]
    }
  }
}))(Button);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    flex: 1,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    background: "#fff"
  },
  margin: {
    margin: theme.spacing(1)
  },
  rootTwo: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: "#fff"
  },
  gridList: {
    flexWrap: "nowrap",
    width: "40vw",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)"
  },
  title: {
    color: theme.palette.primary.light
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
  },
  appBar: {
    position: "relative"
  },
  titleModal: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

const theme = createMuiTheme({
  palette: {
    default: green
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {
  const [items, setItems] = useState([]);
  const [all, setAll] = useState([]);
  const [allQuiz, setAllQuiz] = useState([]);
  const [quiz, setQuiz] = useState(false);
  const [item, setItem] = useState([]);
  const [itemImage, setItemImage] = useState([]);
  const [quizno, setQuizn0] = useState(0);
  const [tmarks, settMarks] = useState(0);
  const [marks, setMarks] = useState(0);
  const [remainingTime, setRemainingTime] = useState(90);
  const [hide, setHide] = useState(false);
  const [counterOff, setCounterOff] = useState(true);
  const [count, setCount] = useState(1);
  const [seconds, setSeconds] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [showCorrectAnswers, setshowCorrectAnswers] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [username, setUsername] = useState("");
  const [initial, setInitial] = useState(true);
  const [rows, setRows] = useState([]);
  const [days, setDays] = useState([]);
  const [d, setD] = useState(3);
  const [vocList, setVocList] = useState([]);

  const [id] = useState(String(Date.now()).toString());
  const [quizCount, setQuizCount] = useState(0);
  const [imageUpload, setImageUpload] = useState(false);
  const [finalSubmit, setFinalSubmit] = useState(false);

  const [open, setOpen] = useState(false);
  const [editQuizId, setEditQuizId] = useState();
  const [editQuizNo, setEditQuizNo] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Username", width: 130 },
    { field: "quiz1", headerName: "quiz-1", width: 130 },
    { field: "quiz2", headerName: "quiz-2", width: 130 },
    { field: "quiz3", headerName: "quiz-3", width: 130 },
    { field: "quiz4", headerName: "quiz-4", width: 130 },
    { field: "quiz5", headerName: "quiz-5", width: 130 },
    { field: "quiz6", headerName: "quiz-6", width: 130 },
    { field: "total", headerName: "Aggregate", width: 130 },
    { field: "day", headerName: "Day", width: 130 },
    { field: "submittedAt", headerName: "Submission", width: 250 }
  ];

  function toggle() {
    setIsActive(!isActive);
  }

  useEffect(() => {
    db.collection("Vocabulary")
      .orderBy("uid", "asc")
      .onSnapshot(function (querySnapShot) {
        var voc = [];
        var vocList = [];
        var count = 1;
        querySnapShot.forEach(function (doc) {
          voc.push(doc.data().data);
          vocList.push(doc.data().uid);
          days.push(count);
          count++;
        });
        setD(days.length);
        setAll(voc);
        setVocList(vocList);
      });

    db.collection("Results")
      .orderBy("submittedAt", "asc")
      .onSnapshot(function (querySnapShot) {
        var result = [];
        var count = 1;
        querySnapShot.forEach(function (doc) {
          result.push({
            ...doc.data(),
            id: count,
            submittedAt: moment(doc.data().submittedAt).format(
              "MMMM Do YYYY, h:mm:ss a"
            )
          });
          count++;
        });
        setRows(result);
      });
  }, []);

  function reset() {
    setSeconds(30);
    setIsActive(true);
  }

  const classes = useStyles();

  useEffect(() => {
    let interval = null;
    if (quiz) {
      interval = setInterval(() => {
        if (remainingTime > 0) {
          setRemainingTime(remainingTime => remainingTime - 1);
        } else {
          setshowCorrectAnswers(true);
          setHide(true);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [quiz, remainingTime]);

  const quizDone = () => {
    let count2 = quizCount;
    setQuizList([...quizList, marks]);
    setCount(count + 1);
    setQuiz(false);
    setMarks(0);
    setHide(false);
    setRemainingTime(90);
    setQuizCount(count2 + 1);
    setshowCorrectAnswers(false);
    toggle();
    console.log(quizList);
  };
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds => seconds - 1);
        } else {
          setSeconds(30);
          setCount(count => count + 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    setRemainingTime(90);
  }, [quiz]);

  const readExcel = file => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = e => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        db.collection("Vocabulary").doc(id).set({
          data: data,
          uid: id
        });

        [1, 2, 3, 4, 5, 6].forEach(e => {
          const wsnamee = wb.SheetNames[e];

          const wss = wb.Sheets[wsnamee];

          const dataa = XLSX.utils.sheet_to_json(wss);

          db.collection("Vocabulary")
            .doc(id)
            .collection(`Quiz${e}`)
            .doc(String(e).toString())
            .set({
              data: dataa,
              image: null
            })
            .then(() => {
              if (e === 6) setImageUpload(true);
            });
        });

        resolve(data);
      };

      fileReader.onerror = error => {
        reject(error);
      };
    });
  };

  const readExcelEdit = file => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = e => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        db.collection("Vocabulary").doc(editQuizId).update({
          data: data
        });

        [1, 2, 3, 4, 5, 6].forEach(e => {
          const wsnamee = wb.SheetNames[e];

          const wss = wb.Sheets[wsnamee];

          const dataa = XLSX.utils.sheet_to_json(wss);

          db.collection("Vocabulary")
            .doc(editQuizId)
            .collection(`Quiz${e}`)
            .doc(String(e).toString())
            .update({
              data: dataa
            })
        });

        resolve(data);
      };

      fileReader.onerror = error => {
        reject(error);
      };
    });
  };

  useEffect(() => {
    setSeconds(30);
    setIsActive(true);
  }, [items.length]);

 const onFormSubmit = e => {
  e.preventDefault();
  setCount(count + 1);
  reset();
  }
  const UploadQuiz = (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            {imageUpload ? (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <h3>Choose choice images for all uploaded quizzes</h3>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item lg={3} xs={12}>
                    <h5>Quiz 1</h5>
                    <input
                      type="file"
                      style={{ marginLeft: "5%" }}
                      onChange={async e => {
                        const file = e.target.files[0];

                        await storage.ref(`/quizzes/${id}/1`).put(file);

                        const remoteUri = await storage
                          .ref("quizzes")
                          .child(`${id}/1`)
                          .getDownloadURL();

                        db.collection("Vocabulary")
                          .doc(id)
                          .collection(`Quiz1`)
                          .doc("1")
                          .update({
                            image: remoteUri
                          });
                      }}
                    />
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <h5>Quiz 2</h5>
                    <input
                      type="file"
                      style={{ marginLeft: "5%" }}
                      onChange={async e => {
                        const file = e.target.files[0];

                        await storage.ref(`/quizzes/${id}/2`).put(file);

                        const remoteUri = await storage
                          .ref("quizzes")
                          .child(`${id}/2`)
                          .getDownloadURL();

                        db.collection("Vocabulary")
                          .doc(id)
                          .collection(`Quiz2`)
                          .doc("2")
                          .update({
                            image: remoteUri
                          });
                      }}
                    />
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <h5>Quiz 3</h5>
                    <input
                      type="file"
                      style={{ marginLeft: "5%" }}
                      onChange={async e => {
                        const file = e.target.files[0];

                        await storage.ref(`/quizzes/${id}/3`).put(file);

                        const remoteUri = await storage
                          .ref("quizzes")
                          .child(`${id}/3`)
                          .getDownloadURL();

                        db.collection("Vocabulary")
                          .doc(id)
                          .collection(`Quiz3`)
                          .doc("3")
                          .update({
                            image: remoteUri
                          });
                      }}
                    />
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <h5>Quiz 4</h5>
                    <input
                      type="file"
                      style={{ marginLeft: "5%" }}
                      onChange={async e => {
                        const file = e.target.files[0];

                        await storage.ref(`/quizzes/${id}/4`).put(file);

                        const remoteUri = await storage
                          .ref("quizzes")
                          .child(`${id}/4`)
                          .getDownloadURL();

                        db.collection("Vocabulary")
                          .doc(id)
                          .collection(`Quiz4`)
                          .doc("4")
                          .update({
                            image: remoteUri
                          });
                      }}
                    />
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <h5>Quiz 5</h5>
                    <input
                      type="file"
                      style={{ marginLeft: "5%" }}
                      onChange={async e => {
                        const file = e.target.files[0];

                        await storage.ref(`/quizzes/${id}/5`).put(file);

                        const remoteUri = await storage
                          .ref("quizzes")
                          .child(`${id}/5`)
                          .getDownloadURL();

                        db.collection("Vocabulary")
                          .doc(id)
                          .collection(`Quiz5`)
                          .doc("5")
                          .update({
                            image: remoteUri
                          });
                      }}
                    />
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <h5>Quiz 6</h5>
                    <input
                      type="file"
                      style={{ marginLeft: "5%" }}
                      onChange={async e => {
                        const file = e.target.files[0];

                        await storage.ref(`/quizzes/${id}/6`).put(file);

                        const remoteUri = await storage
                          .ref("quizzes")
                          .child(`${id}/6`)
                          .getDownloadURL();

                        db.collection("Vocabulary")
                          .doc(id)
                          .collection(`Quiz6`)
                          .doc("6")
                          .update({
                            image: remoteUri
                          });
                      }}
                    />
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <h5>Final</h5>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setImageUpload(false);
                        alert("Day is setup");
                      }}
                    >
                      Upload
                    </Button>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Grid container spacing={2}>
                  <Grid item style={{ textAlign: "right" }} xs={12}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setInitial(true);
                      }}
                    >
                      Logout
                    </Button>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <h3>Choose a file in .xlsx format</h3>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <input
                      type="file"
                      style={{ marginLeft: "5%" }}
                      onChange={e => {
                        const file = e.target.files[0];
                        readExcel(file);
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h3>Uploaded Days</h3>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              style={{
                border: "1px solid #d2d2d4",
                borderRadius: "0.3em",
                width: "97vw",
                marginLeft: "0.5vw"
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <h3>Sr.</h3>
                </Grid>
                <Grid item xs={2}>
                  <h3>Days</h3>
                </Grid>
                <Grid item xs={4}>
                  <h3>Uploaded At</h3>
                </Grid>
                <Grid item xs={4}>
                  <h3>Options</h3>
                </Grid>
              </Grid>
              {vocList.map((e, i) => {
                return (
                  <Grid container spacing={2}>
                    <Grid item xs={2}>
                      <p>{i + 1}.</p>
                    </Grid>
                    <Grid item xs={2}>
                      <p>Day {i + 1}</p>
                    </Grid>
                    <Grid item xs={4}>
                      <p>
                        {moment(parseInt(e)).format("MMMM Do YYYY, h:mm:ss a")}
                      </p>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        variant="outlined"
                        color="primary"
                        style={{ marginRight: "1em" }}
                        onClick={() => {
                          setEditQuizId(e);
                          setEditQuizNo(i + 1);
                          handleClickOpen();
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          db.collection("Vocabulary")
                            .doc(e)
                            .collection("Quiz1")
                            .doc("1")
                            .delete();
                          db.collection("Vocabulary")
                            .doc(e)
                            .collection("Quiz2")
                            .doc("2")
                            .delete();
                          db.collection("Vocabulary")
                            .doc(e)
                            .collection("Quiz3")
                            .doc("3")
                            .delete();
                          db.collection("Vocabulary")
                            .doc(e)
                            .collection("Quiz4")
                            .doc("4")
                            .delete();
                          db.collection("Vocabulary")
                            .doc(e)
                            .collection("Quiz5")
                            .doc("5")
                            .delete();
                          db.collection("Vocabulary")
                            .doc(e)
                            .collection("Quiz6")
                            .doc("6")
                            .delete();
                          db.collection("Vocabulary")
                            .doc(e)
                            .delete()
                            .then(() => {
                              storage.ref("quizzes").child(`${e}/1`).delete();
                              storage.ref("quizzes").child(`${e}/2`).delete();
                              storage.ref("quizzes").child(`${e}/3`).delete();
                              storage.ref("quizzes").child(`${e}/4`).delete();
                              storage.ref("quizzes").child(`${e}/5`).delete();
                              storage.ref("quizzes").child(`${e}/6`).delete().then(()=>{
                                alert("Day deleted");
                              })
                             
                            });
                        }}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h3>Student Quiz Marks</h3>
              </Grid>
            </Grid>

            <div style={{ height: 450, width: "100%" }}>
              <DataGrid rows={rows} columns={columns} pageSize={5} />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );

  return (
    <div>
      {initial ? (
        <div className="container">
          <Grid container style={{ flex: 1, background: "#fff" }} spacing={2}>
            <Grid item xs={12} lg={6} style={{ textAlign: "center" }}>
              <h3>For Students</h3>

              <div>
                <Grid container xs={12} lg={12} className={classes.rootTwo}>
                  <GridList
                    className={classes.gridList}
                    style={{ justifyContent: "center" }}
                    cols={1.5}
                  >
                    {days.map((day, i) => (
                      <Grid
                        key={i}
                        style={
                          d === day
                            ? {
                                border: "1px solid #d2d2d4",
                                height: "7",
                                margin: "1vh",
                                borderRadius: 5,
                                background: "#303F9F"
                              }
                            : {
                                border: "1px solid #d2d2d4",
                                height: "7",
                                margin: "1vh",
                                borderRadius: 5
                              }
                        }
                      >
                        <Button
                          variant="text"
                          onClick={() => setD(day)}
                          style={
                            d === day
                              ? {
                                  color: "#fff",
                                  width: "7",
                                  textAlign: "center"
                                }
                              : {
                                  color: "#000",
                                  width: "7",
                                  textAlign: "center"
                                }
                          }
                        >
                          Day {day}
                        </Button>
                      </Grid>
                    ))}
                  </GridList>
                </Grid>
              </div>

              {days.length ? (
                <Button
                  variant="contained"
                  style={{ marginTop: 10 }}
                  color="primary"
                  onClick={() => {
                    setItems(all[d - 1]);
                    [1, 2, 3, 4, 5, 6].forEach(e => {
                      db.collection("Vocabulary")
                        .doc(vocList[d - 1])
                        .collection(`Quiz${e}`)
                        .onSnapshot(function (querySnapShot) {
                          querySnapShot.forEach(function (doc) {
                            item.push(doc.data().data);
                            itemImage.push(doc.data().image);
                          });
                        });
                      console.log(item);
                    });
                    setInitial(false);
                  }}
                >
                  Attempt Quiz
                </Button>
              ) : (
                <h4>Fetching Data ..</h4>
              )}
            </Grid>
            <Grid item xs={12} lg={6} style={{ textAlign: "center" }}>
              <h3>For Teachers</h3>
              <Button
                variant="contained"
                style={{ marginTop: 10 }}
                color="secondary"
                onClick={() => {
                  const password = prompt("Please Enter password");
                  if (password === "123") setInitial(false);
                  else alert("Wrong Password Entered");
                }}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </div>
      ) : (
        <div className="container">
          {!items.length ? (
            UploadQuiz
          ) : quizList.length === 6 ? (
            <div className={classes.root}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid className={classes.paper}>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={12}
                        style={{
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <h1 style={{ color: "orange" }}>Congratulations!</h1>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={12}
                        style={{
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <h1 style={{ color: "black" }}>
                          Today's task are done
                        </h1>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      style={{ justifyContent: "space-evenly" }}
                    >
                      <Grid item xs={0} lg={3} />
                      <Grid
                        item
                        xs={12}
                        lg={3}
                        style={{
                          textAlign: "left",
                          border: "1px solid gray",
                          borderRadius: 10
                        }}
                      >
                        {quizList.map((q, i) => {
                          return (
                            <Grid
                              container
                              spacing={0}
                              style={{ justifyContent: "space-evenly" }}
                            >
                              <Grid item xs={6}>
                                <h3 style={{ textAlign: "center" }}>
                                  Mini Quiz {i + 1}
                                </h3>
                              </Grid>
                              <Grid item xs={6}>
                                <h2
                                  style={{
                                    textAlign: "center",
                                    color: "green"
                                  }}
                                >
                                  {q}
                                </h2>
                              </Grid>
                            </Grid>
                          );
                        })}
                      </Grid>
                      <Grid item xs={0} lg={3} />
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={12}
                        style={{
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {!finalSubmit && (
                          <TextField
                            id="name"
                            label="Your name"
                            variant="standard"
                            onChange={e => {
                              setUsername(e.target.value);
                            }}
                            style={{
                              marginTop: 50
                            }}
                          />
                        )}
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={12}
                        style={{
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {finalSubmit ? (
                          <Button
                            variant="text"
                            className={classes.margin}
                            style={{
                              marginTop: 10,
                              color: "#06a94d",
                              border: "1px solid #06a94d"
                            }}
                            onClick={() => {
                              setInitial(true);
                              setQuizList([]);
                              setFinalSubmit(false);
                            }}
                          >
                            Return to Home
                          </Button>
                        ) : (
                          <Button
                            variant="text"
                            className={classes.margin}
                            style={{
                              marginTop: 10,
                              color: "#fff",
                              background: "#06a94d"
                            }}
                            onClick={() => {
                              db.collection("Results")
                                .add({
                                  name: username,
                                  quiz1: quizList[0],
                                  quiz2: quizList[1],
                                  quiz3: quizList[2],
                                  quiz4: quizList[3],
                                  quiz5: quizList[4],
                                  quiz6: quizList[5],
                                  submittedAt: Date.now(),
                                  total:
                                    quizList[0] +
                                    quizList[1] +
                                    quizList[2] +
                                    quizList[3] +
                                    quizList[4] +
                                    quizList[5],
                                  day: `Day ${d}`
                                })
                                .then(() => {
                                  setUsername("");
                                  setFinalSubmit(true);
                                  alert("Your Result was submitted");
                                });
                            }}
                          >
                            Notify Tutor
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          ) : !quiz ? (
            <div className={classes.root}>
              <form onSubmit={onFormSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid className={classes.paper}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <h1 style={{ color: "green" }}>Vocabulary</h1>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      style={{ justifyContent: "space-evenly" }}
                    >
                      <Grid item xs={0} lg={3} />
                      <Grid
                        item
                        xs={12}
                        lg={6}
                        style={{
                          textAlign: "left",
                          border: "1px solid gray",
                          borderRadius: 10
                        }}
                      >
                        {items.map((q, i) => {
                          if (q.order === count && q.definitionandexamples) {
                            return (
                              <>
                                <h3 style={{ textAlign: "center" }}>
                                  {q.wordroot}
                                </h3>
                                <h2
                                  style={{
                                    textAlign: "center",
                                    color: "green"
                                  }}
                                >
                                  {q.word}
                                </h2>
                                <h5>{q.definitionandexamples}</h5>
                              </>
                            );
                          } else if (q.order === count && q.word) {
                            setQuizn0(quizno + 1);
                            setQuiz(true);
                            toggle();
                          }
                        })}
                      </Grid>
                      <Grid item xs={0} lg={3} />
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <h4>{seconds}s</h4>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          style={{ marginTop: 10 }}
                          color="primary"
                          onClick={() => {
                            setCount(count > 1 ? count - 1 : count);
                          }}
                        >
                          <ArrowBackSharp />
                        </Button>
                      </Grid>

                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          style={{ marginTop: 10 }}
                          color="primary"
                          type="submit"
                          // onClick={() => {
                          //   setCount(count + 1);
                          //   reset();
                          // }}
                        >
                          <ArrowForwardSharp />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              </form>
            </div>
          ) : (
            <div className={classes.root}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <img
                          src="data:image/png;base64,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"
                          alt="Quiz Icon"
                          style={{ height: 40 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <h3>Mini Quiz {quizno}</h3>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <h5>
                          Fill out the fields using numbers referring the
                          choices section. For instance, (1 for annual)
                        </h5>
                      </Grid>
                    </Grid>

                    <Grid container spacing={5}>
                      <Grid item xs={3}>
                        <h4>Questions</h4>
                      </Grid>
                      <Grid item xs={3}>
                        <h4>Choose Answers</h4>
                      </Grid>
                      <Grid item xs={3}>
                        <h4>Correct Answers</h4>
                      </Grid>
                      <Grid item xs={3}>
                        <h4>Choices</h4>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={9}>
                        {item[quizCount].map((q, i) => {
                          return (
                            <Grid container spacing={2}>
                              <Grid item xs={3}>
                                <h3 style={{ fontSize: "1rem" }}>
                                  {q.Question}
                                </h3>
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  id="answer"
                                  label="Choice"
                                  variant="outlined"
                                  style={{ width: "auto" }}
                                  onChange={e => {
                                    if (e.target.value == q.rightanswer) {
                                      settMarks(tmarks + 1);
                                      setMarks(marks + 1);
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={3}>
                                {showCorrectAnswers ? (
                                  <h3>{q.rightanswer}</h3>
                                ) : null}
                              </Grid>
                            </Grid>
                          );
                        })}
                      </Grid>
                      <Grid item xs={3}>
                        <img
                          src={itemImage[quizCount]}
                          alt="Quiz Icon"
                          style={{ flex: 1 }}
                        />
                      </Grid>
                    </Grid>

                    {counterOff && (
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <h4>{remainingTime}s</h4>
                        </Grid>
                      </Grid>
                    )}

                    {!hide && (
                      <Button
                        variant="outlined"
                        style={{ width: "75%", marginTop: 10 }}
                        color="primary"
                        onClick={() => {
                          setRemainingTime(0);
                        }}
                      >
                        Submit Quiz
                      </Button>
                    )}

                    {showCorrectAnswers && (
                      <>
                        <Grid container spacing={2}>
                          <Grid
                            item
                            xs={12}
                            style={{
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <h1 style={{ color: "black" }}>
                              You have scored {marks} out of 8
                            </h1>
                          </Grid>
                        </Grid>
                      </>
                    )}

                    {showCorrectAnswers && (
                      <Button
                        variant="outlined"
                        style={{ width: "75%", marginTop: 10 }}
                        color="primary"
                        onClick={quizDone}
                      >
                        Proceed
                      </Button>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </div>
          )}
        </div>
      )}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.titleModal}>
              Day {editQuizNo}
            </Typography>
            <Button autoFocus color="inherit" onClick={()=>{
              handleClose()
            }}>
              save
            </Button>
          </Toolbar>
        </AppBar>

        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <h3>Choose a file in .xlsx format</h3>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          style={{ textAlign: "center", marginBottom: "2em" }}
        >
          <Grid item xs={12}>
            <input
              type="file"
              style={{ marginLeft: "5%" }}
              onChange={e => {
                const file = e.target.files[0];

                readExcelEdit(file);
              }}
            />
          </Grid>
        </Grid>
        <Divider />

        <>
          <Grid container style={{ textAlign: "center" }} spacing={2}>
            <Grid item xs={12}>
              <h3>Choose any uploaded quizzes to update choice image</h3>
            </Grid>
          </Grid>

          <Grid container style={{ textAlign: "center" }} spacing={2}>
            <Grid item lg={3} xs={12}>
              <h5>Quiz 1</h5>
              <input
                type="file"
                style={{ marginLeft: "5%" }}
                onChange={async e => {
                  const file = e.target.files[0];

                  await storage.ref(`/quizzes/${editQuizId}/1`).put(file);

                  const remoteUri = await storage
                    .ref("quizzes")
                    .child(`${editQuizId}/1`)
                    .getDownloadURL();

                  db.collection("Vocabulary")
                    .doc(editQuizId)
                    .collection(`Quiz1`)
                    .doc("1")
                    .update({
                      image: remoteUri
                    })
                }}
              />
            </Grid>
            <Grid item lg={3} xs={12}>
              <h5>Quiz 2</h5>
              <input
                type="file"
                style={{ marginLeft: "5%" }}
                onChange={async e => {
                  const file = e.target.files[0];

                  await storage.ref(`/quizzes/${editQuizId}/2`).put(file);

                  const remoteUri = await storage
                    .ref("quizzes")
                    .child(`${editQuizId}/2`)
                    .getDownloadURL();

                  db.collection("Vocabulary")
                    .doc(editQuizId)
                    .collection(`Quiz2`)
                    .doc("2")
                    .update({
                      image: remoteUri
                    });
                }}
              />
            </Grid>
            <Grid item lg={3} xs={12}>
              <h5>Quiz 3</h5>
              <input
                type="file"
                style={{ marginLeft: "5%" }}
                onChange={async e => {
                  const file = e.target.files[0];

                  await storage.ref(`/quizzes/${editQuizId}/3`).put(file);

                  const remoteUri = await storage
                    .ref("quizzes")
                    .child(`${editQuizId}/3`)
                    .getDownloadURL();

                  db.collection("Vocabulary")
                    .doc(editQuizId)
                    .collection(`Quiz3`)
                    .doc("3")
                    .update({
                      image: remoteUri
                    });
                }}
              />
            </Grid>
            <Grid item lg={3} xs={12}>
              <h5>Quiz 4</h5>
              <input
                type="file"
                style={{ marginLeft: "5%" }}
                onChange={async e => {
                  const file = e.target.files[0];

                  await storage.ref(`/quizzes/${editQuizId}/4`).put(file);

                  const remoteUri = await storage
                    .ref("quizzes")
                    .child(`${editQuizId}/4`)
                    .getDownloadURL();

                  db.collection("Vocabulary")
                    .doc(editQuizId)
                    .collection(`Quiz4`)
                    .doc("4")
                    .update({
                      image: remoteUri
                    });
                }}
              />
            </Grid>
            <Grid item lg={3} xs={12}>
              <h5>Quiz 5</h5>
              <input
                type="file"
                style={{ marginLeft: "5%" }}
                onChange={async e => {
                  const file = e.target.files[0];

                  await storage.ref(`/quizzes/${editQuizId}/5`).put(file);

                  const remoteUri = await storage
                    .ref("quizzes")
                    .child(`${editQuizId}/5`)
                    .getDownloadURL();

                  db.collection("Vocabulary")
                    .doc(editQuizId)
                    .collection(`Quiz5`)
                    .doc("5")
                    .update({
                      image: remoteUri
                    });
                }}
              />
            </Grid>
            <Grid item lg={3} xs={12}>
              <h5>Quiz 6</h5>
              <input
                type="file"
                style={{ marginLeft: "5%" }}
                onChange={async e => {
                  const file = e.target.files[0];

                  await storage.ref(`/quizzes/${editQuizId}/6`).put(file);

                  const remoteUri = await storage
                    .ref("quizzes")
                    .child(`${editQuizId}/6`)
                    .getDownloadURL();

                  db.collection("Vocabulary")
                    .doc(editQuizId)
                    .collection(`Quiz6`)
                    .doc("6")
                    .update({
                      image: remoteUri
                    });
                }}
              />
            </Grid>
          </Grid>
        </>
      </Dialog>
    </div>
  );
}

export default App;
