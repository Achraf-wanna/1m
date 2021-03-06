import React from 'react'
import axios from 'axios'
// import Question from './question'
import  { Redirect } from 'react-router-dom'
import {useHistory} from "react-router-dom";

export default function Game() {
    let history = useHistory();
    const code = localStorage.getItem('group')
    const [question, setQuestion] = React.useState([])
    const [choise, setChoise] = React.useState([])
    const [questionNember, setQuestionNumber] = React.useState([])
    async function QuestionNumber(){
        axios.get(process.env.REACT_APP_URL+'participant/getNumber/'+localStorage.getItem('group'))
        .then(doc=>{
            setQuestionNumber(doc.data.questions)
            
        })
        .catch(err=>{console.log(err)})
    }
    
    React.useEffect(()=>{
        QuestionNumber()
        let repeat;
        function getQuestion() {
            console.log(process.env.REACT_APP_URL + 'participant/getQuestion/' + code);
            axios.get(process.env.REACT_APP_URL + 'participant/getQuestion/' + code)
                .then(async doc => {
                    setQuestion(doc.data)
                    const choise = doc.data.false_choise
                    const anwser = doc.data.answer
                    choise.push(anwser)
                    setChoise(choise)
                    repeat = setTimeout(getQuestion, 3000);
                    repeat = getQuestion
                    QuestionNumber()
                })
                .catch(err => console.log(err))
        }
        getQuestion()
                if(repeat){
                    clearTimeout(repeat)
                }

    }, [])

    async function handelButton(e){
        const anwser = e.target.value;
        const group = parseInt(localStorage.getItem('group'))
        const token = localStorage.getItem('token')
        const body = {
            "group" : group,
            "anwser" : anwser
        }

        await axios.post(process.env.REACT_APP_URL+'participant/addAnwser/'+question._id,body,{
            headers:{
                'x-auth-token':token
            }
        })
        .then(doc=>{console.log(doc);
            if(doc.data =="game over"){
                history.push('/winer')
            }
         
        })
        .catch(err=>{console.log(err);})
        
    }
    return (
        <div className="ccolor">
            <div  className="alert alert success">{question.quest}</div>
            <button className="btn btn-success" value={choise[0]} onClick={(event)=>{handelButton(event)}}>{choise[0]}</button>
            <button className="btn btn-success" value={choise[1]} onClick={(event)=>{handelButton(event)}}>{choise[1]}</button>
            <button className="btn btn-success" value={choise[2]} onClick={(event)=>{handelButton(event)}}>{choise[2]}</button>
            <button className="btn btn-success" value={choise[3]} onClick={(event)=>{handelButton(event)}}>{choise[3]}</button>

        </div>
    )
}
