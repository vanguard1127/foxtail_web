import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { CREATE_USER, FB_RESOLVE, LOGIN } from '../../queries';
import SignupForm from './SignupForm';
const initialState = {
  username: '',
  email: '',
  phone: '',
  dob: '',
  interestedIn: [],
  gender: '',
  isCouple: false,
  csrf: '',
  code: ''
};

class Signup extends PureComponent {
  state = { ...initialState };

  componentDidMount() {
    this.mounted = true;
    this.props.ErrorHandler.setBreadcrumb('Signup loaded');
    if (localStorage.getItem('token') !== null) {
      //TODO: Check somehow if user active...Possibly use session.

      this.props.history.push('/members');
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  clearState = () => {
    if (this.mounted) {
      this.setState({ ...initialState });
    }
  };

  setFormValues = values => {
    if (this.mounted) {
      this.setState(values);
    }
  };

  handleFBReturn = ({ state, code }, fbResolve, createUser) => {
    if (this.mounted) {
      this.setState(
        {
          csrf: state,
          code
        },
        () => {
          fbResolve()
            .then(({ data }) => {
              const { isCouple } = this.state;
              if (data.fbResolve === null) {
                alert('Phone verification failed.');
                return;
              }
              this.setState({ phone: data.fbResolve });
              createUser()
                .then(({ data }) => {
                  if (data.createUser === null) {
                    alert('Signup failed.');
                    return;
                  }
                  localStorage.setItem(
                    'token',
                    data.createUser.find(token => token.access === 'auth').token
                  );
                  localStorage.setItem(
                    'refreshToken',
                    data.createUser.find(token => token.access === 'refresh')
                      .token
                  );

                  if (isCouple) {
                    this.props.history.push({
                      pathname: '/settings',
                      state: { couple: true, initial: true }
                    });
                  } else {
                    this.props.history.push({
                      pathname: '/settings',
                      state: { initial: true }
                    });
                  }
                })
                .catch(res => {
                  this.props.ErrorHandler.catchErrors(res.graphQLErrors);
                });
            })
            .catch(res => {
              this.props.ErrorHandler.catchErrors(res.graphQLErrors);
            });
        }
      );
    }
  };

  testCreateUser = createUser => {
    if (this.mounted) {
      const rand = Math.floor(10000000 + Math.random() * 1000);
      this.setState(
        {
          phone: rand.toString(),
          username: 'TEST USER2',
          email: rand.toString() + '@test.com',
          dob: '12/12/1990',
          interestedIn: ['M'],
          gender: 'M',
          isCouple: true
        },
        () =>
          createUser()
            .then(({ data }) => {
              if (data.createUser === null) {
                alert('Signup failed.');
                return;
              }
              localStorage.setItem(
                'token',
                data.createUser.find(token => token.access === 'auth').token
              );
              localStorage.setItem(
                'refreshToken',
                data.createUser.find(token => token.access === 'refresh').token
              );

              const { isCouple } = this.state;
              if (isCouple) {
                this.props.history.push({
                  pathname: '/settings',
                  state: { couple: true, initial: true }
                });
              } else {
                this.props.history.push({
                  pathname: '/settings',
                  state: { initial: true }
                });
              }
            })
            .catch(res => {
              this.props.ErrorHandler.catchErrors(res.graphQLErrors);
            })
      );
    }
  };

  //TODO:DELETE THIS
  handleLogin = login => {
    if (this.mounted) {
      login()
        .then(async ({ data }) => {
          if (data.login === null) {
            alert("User doesn't exist.");
            return;
          }

          localStorage.setItem(
            'token',
            data.login.find(token => token.access === 'auth').token
          );
          localStorage.setItem(
            'refreshToken',
            data.login.find(token => token.access === 'refresh').token
          );
          // await this.props.refetch();
          this.props.history.push('/members');
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          return errors;
        });
    }
  };

  render() {
    const { t, setBreadcrumb, ErrorHandler } = this.props;
    let {
      csrf,
      code,
      phone,
      username,
      email,
      dob,
      interestedIn,
      gender,
      isCouple
    } = this.state;

    return (
      <Mutation mutation={FB_RESOLVE} variables={{ csrf, code }}>
        {fbResolve => {
          return (
            <Mutation
              mutation={CREATE_USER}
              variables={{
                phone,
                username,
                email,
                dob,
                interestedIn,
                gender,
                isCouple,
                lang: localStorage.getItem('i18nextLng')
              }}
            >
              {createUser => {
                return (
                  <div className="register-form">
                    <div className="head">
                      {t('Become a')} <b>Foxtail</b> {t('Member')}
                    </div>
                    <SignupForm
                      fields={{
                        username: '',
                        email: '',
                        dob: '',
                        interestedIn: [],
                        gender: '',
                        isCouple: false
                      }}
                      fbResolve={fbResolve}
                      createUser={createUser}
                      handleFBReturn={this.handleFBReturn}
                      setFormValues={this.setFormValues}
                      setBreadcrumb={setBreadcrumb}
                      t={t}
                      ErrorHandler={ErrorHandler}
                    />
                    <div className="form terms">
                      <span onClick={() => this.testCreateUser(createUser)}>
                        Test Create
                      </span>
                      <br />
                      <br />
                      Test Users:
                      <Mutation mutation={LOGIN} variables={{ phone }}>
                        {(login, { loading, error }) => {
                          return (
                            <>
                              <span
                                onClick={() => {
                                  this.setState({ phone: '1' }, () => {
                                    this.handleLogin(login);
                                  });
                                }}
                              >
                                1
                              </span>{' '}
                              <span
                                onClick={() => {
                                  this.setState({ phone: '2' }, () => {
                                    this.handleLogin(login);
                                  });
                                }}
                              >
                                2
                              </span>{' '}
                              <span
                                href={null}
                                onClick={() => {
                                  this.setState({ phone: '3' }, () => {
                                    this.handleLogin(login);
                                  });
                                }}
                              >
                                3
                              </span>{' '}
                              <span
                                onClick={() => {
                                  this.setState({ phone: '4' }, () =>
                                    this.handleLogin(login)
                                  );
                                }}
                              >
                                4
                              </span>
                              <span
                                onClick={() => {
                                  this.setState({ phone: '5' }, () => {
                                    this.handleLogin(login);
                                  });
                                }}
                              >
                                5
                              </span>
                            </>
                          );
                        }}
                      </Mutation>
                    </div>
                  </div>
                );
              }}
            </Mutation>
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(Signup);
