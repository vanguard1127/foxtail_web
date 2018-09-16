import React from 'react';
import {withRouter} from 'react-router-dom';
import {Mutation} from 'react-apollo';
import {CREATE_USER} from '../../queries';
import Error from '../Error';

const initialState={
  username:"",
  email:"",
  password:"",
  passwordConfirm:"",
  phone:"",
  dob:"",
  desires:"",
  interestedIn:"",
  sex:""
};

class Signup extends React.Component{

  state={...initialState};

clearState=()=>{
this.setState({...initialState });
}

  handleChange = event =>{
const {name,value}=event.target;
this.setState({[name]:value});
  }

  handleSubmit =(event,createUser)=>{
event.preventDefault();
createUser().then(async ({data})=>{
  console.log(data);
  localStorage.setItem('token',data.createUser.token);
  await this.props.refetch();
  this.clearState();
  this.props.history.push('/');
});
  }

  validateForm=()=>{
    const {username,email,password,passwordConfirm,phone,
      dob,desires,interestedIn,sex}=this.state;
      const isInvalid = !username||!email||!password||!passwordConfirm||password!== passwordConfirm||
      !phone||!dob||!desires||!interestedIn||!sex;
      return isInvalid;
  }

  render(){
const {username,email,password,passwordConfirm,phone,
  dob,desires,interestedIn,sex}=this.state;

    return(
      <div>
        <h2 className="App">Signup</h2>
        <Mutation mutation={CREATE_USER} variables={{username,email,password,phone,
        dob,desires,interestedIn,sex}}>
          {(createUser,{data,loading,error})=>{

return(
<form className="form" onSubmit={event=>this.handleSubmit(event,createUser)}>
<input type="text" name="username" placeholder="Name" onChange={this.handleChange} value={username} />
<input type="text" name="email" placeholder="Email Address" onChange={this.handleChange} value={email}/>
<input type="password" name="password" placeholder="Password" onChange={this.handleChange} value={password}/>
<input type="password" name="passwordConfirm" placeholder="Confirm Password" onChange={this.handleChange} value={passwordConfirm}/>
<input type="text" name="phone" placeholder="Phone" onChange={this.handleChange} value={phone}/>
<input type="text" name="dob" placeholder="DOB" onChange={this.handleChange} value={dob}/>
<input type="text" name="desires" placeholder="Desires" onChange={this.handleChange} value={desires}/>
<input type="text" name="interestedIn" placeholder="Interested In" onChange={this.handleChange} value={interestedIn}/>
<input type="text" name="sex" placeholder="Sex" onChange={this.handleChange} value={sex}/>
<button type="submit" disabled={loading||this.validateForm()} className="button-primary">Sign Up!</button>
{error && <Error error={error}/>}
</form>
);

          }}

        </Mutation>
      </div>
    )
  }
}

export default withRouter(Signup);
