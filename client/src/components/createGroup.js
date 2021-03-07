import React from 'react'
import axios from 'axios';
import {toast} from 'react-toastify'
import {useHistory} from "react-router-dom";
import '../style/createGroup.css'

export default function CreateGroup() {
    let history = useHistory();
    const token = localStorage.getItem('token')
    const [code, setCode] = React.useState()
    const [member, setMember] = React.useState()
    function create() {
        axios.post(process.env.REACT_APP_URL + 'participant/creatGroup', {}, { headers: { 'x-auth-token': token } })
            .then(doc => {
                console.log(doc.data);
                setCode(doc.data.group.code)
                localStorage.setItem('group', doc.data.group.code)
                toast.configure()
                toast.success('group created code goup is :'+doc.data.group.code)
            })
            .catch(err => { console.log(err) })
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
        <div className="grpc">
            <button className="btn btn-success" onClick={() => create()}>Create Group</button>
            {code && <div className="codee">The Group Code Is: {code}</div>}
            {member && <div className="codee">Members on the lobby: {member}</div>}
        </div>
    )
}
