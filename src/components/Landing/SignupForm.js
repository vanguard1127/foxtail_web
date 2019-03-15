import React, { Component } from 'react';
import * as yup from 'yup';
import DatePicker from '../common/DatePicker';
import Dropdown from '../common/Dropdown';
import SignupButton from './SignupButton';
import isEmpty from '../../utils/isEmpty.js';

let date = new Date();
date.setFullYear(date.getFullYear() - 18);
const schema = yup.object().shape({
  interestedIn: yup.array().required('Interest is required!'),
  gender: yup.string().required('Gender is required!'),
  dob: yup
    .date()
    .nullable()
    .default(null)
    .max(date, 'You must be at least 18 years old!')
    .required('Birthdate is required!'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required!'),
  username: yup.string().required('Username is required!')
});

class SignupForm extends Component {
  state = {
    username: '',
    email: '',
    dob: null,
    gender: '',
    interestedIn: [],
    isCouple: false,
    isValid: false,
    errors: {}
  };
  shouldComponentUpdate(nextProps, nextState) {
    console.log('NEW:', nextState);
    console.log('OLD:', this.state);
    console.log('EQUALS:', this.state.errors === nextState.errors);
    return true;
  }
  componentDidMount() {
    this.props.setBreadcrumb('Signup Form loaded');
  }
  setValue = ({ name, value }) => {
    this.setState({ [name]: value }, () => {
      if (!isEmpty(this.state.errors)) {
        this.validateForm();
      }
    });
  };

  validateForm = async () => {
    try {
      await schema.validate(this.state);
      this.setState({ isValid: true, errors: {} });
    } catch (e) {
      console.log(e);
      let errors = { [e.path]: e.message };

      this.setState({ isValid: false, errors });
    }
  };

  InputFeedback = error =>
    error ? (
      <div className="input-feedback" style={{ color: 'red' }}>
        {error}
      </div>
    ) : null;

  render() {
    const { fbResolve, createUser, handleFBReturn, t } = this.props;
    const {
      username,
      email,
      dob,
      gender,
      interestedIn,
      isCouple,
      isValid,
      errors
    } = this.state;
    const lang = localStorage.getItem('i18nextLng');

    return (
      <form>
        <div className="form-content">
          <div className="input username">
            <input
              placeholder={t('userLbl')}
              type="text"
              onChange={e => {
                this.setValue({
                  name: 'username',
                  value: e.target.value
                });
              }}
              value={username}
            />
            {this.InputFeedback(errors.username)}
          </div>
          <div className="input email">
            <input
              placeholder={t('emailLbl')}
              type="email"
              onChange={e => {
                this.setValue({
                  name: 'email',
                  value: e.target.value
                });
              }}
              value={email}
            />
            {this.InputFeedback(errors.email)}
          </div>
          <DatePicker
            value={dob}
            onChange={e => {
              this.setValue({
                name: 'dob',
                value: e
              });
            }}
            t={t}
            type="birthday"
          />
          {this.InputFeedback(errors.dob)}
          <Dropdown
            value={gender}
            type={'gender'}
            onChange={e => {
              this.setValue({
                name: 'gender',
                value: e.value
              });
            }}
            placeholder={t('common:Gender') + ':'}
            lang={lang}
          />
          {this.InputFeedback(errors.gender)}

          <Dropdown
            value={interestedIn}
            type={'interestedIn'}
            onChange={el => {
              this.setValue({
                name: 'interestedIn',
                value: el.map(e => e.value)
              });
            }}
            placeholder={t('common:Interested') + ':'}
            lang={lang}
          />
          {this.InputFeedback(errors.interestedIn)}
          <div className="couple-choose">
            <div className="select-checkbox">
              <input
                type="checkbox"
                id="cbox"
                checked={isCouple}
                onChange={el => {
                  this.setValue({
                    name: 'isCouple',
                    value: el.target.checked
                  });
                }}
              />
              <label htmlFor="cbox">
                <span />
                <b>{t('coupleBox')}</b>
              </label>
            </div>
          </div>
          <SignupButton
            disabled={!isValid}
            fbResolve={fbResolve}
            createUser={createUser}
            handleFBReturn={handleFBReturn}
            setValue={this.setValue}
            validateForm={this.validateForm}
            t={t}
          />
          <div className="terms">
            {t('signupMsg')}
            <span>{t('tnp')}</span>
          </div>
        </div>
      </form>
    );
  }
}

export default SignupForm;
