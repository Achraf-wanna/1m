import React from 'react'
import axios from 'axios';
import { toast } from 'react-toastify'
import {useHistory} from 'react-router-dom'
import '../style/createGroup.css'

export default function JoinGroup() {
    const history = useHistory()
    const token = localStorage.getItem('token')
    const [codeJoin, setCodeJoin] = React.useState()
    const [member, setMember] = React.useState()
    function handleCode(e) {
        const code = e.target.value
        setCodeJoin(code)

    }
    function joinGroup() {
        axios.patch(process.env.REACT_APP_URL + 'participant/joinGroup', { code: codeJoin }, { headers: { 'x-auth-token': token } })
            .then(doc => {
                toast.configure()
                switch (doc.data.message) {
                    case 'can\'t play more than 4 players':
                        toast.error(doc.data.message)
                        break;
                    case 'you are already joined':
                        toast.warning(doc.data.message)
                        break;
                    case 'delete from the first group and reset point to 0':
                    case 'add new participant in team':
                    
                        toast.success('you are add to this team wait a min to start the game')
                        localStorage.setItem('group', doc.data.group.code)
                        break;    
                    default:
                        break;
                }
                
            })
            .catch(err => console.log(err.message))
    }

    setInterval(()=>{if(localStorage.getItem('group')){
        axios.get(process.env.REACT_APP_URL+'participant/getNumber/'+localStorage.getItem('group'))
        .then(doc=>{
            setMember(doc.data.number)
            if(member===4){
                
                history.push('/')
            }
        })
        .catch(err=>{console.log(err)})
    }},2000)
    
    
    return (
        <div>
            <input className="inp" type="number" placeholder="Game Code" onChange={(event) => handleCode(event)} />
            <button className="btn btn-danger" onClick={() => joinGroup()}>join</button>
            {member && <div className="codee" >Members on the lobby:{member}</div>}
        </div>
    )
}
