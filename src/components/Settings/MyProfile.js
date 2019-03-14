import React, { PureComponent } from 'react';
import DesiresSelector from '../Modals/Desires/Selector';

class MyProfile extends PureComponent {
  render() {
    const {
      desires,
      about,
      setValue,
      togglePopup,
      t,
      errors,
      ErrorBoundary
    } = this.props;

    return (
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <span className="heading">{t('myprofile')}</span>
          </div>
          <div className="col-md-12">
            <div className="item">
              <DesiresSelector
                desires={desires}
                togglePopup={togglePopup}
                ErrorBoundary={ErrorBoundary}
              />
              {errors.desires && (
                <label className="errorLbl">{errors.desires}</label>
              )}
            </div>
          </div>
          <div className="col-md-12">
            <div className="item">
              <div className="textarea">
                <label>{t('probio')}:</label>
                <ErrorBoundary>
                  <textarea
                    onChange={e =>
                      setValue({
                        name: 'about',
                        value: e.target.value,
                        noSave: true
                      })
                    }
                    onMouseLeave={e => {
                      console.log('SAVE2');
                      setValue({
                        name: 'about',
                        value: e.target.value
                      });
                    }}
                    onBlur={e => {
                      console.log('SAVE');
                      setValue({
                        name: 'about',
                        value: e.target.value
                      });
                    }}
                    value={about}
                  />
                </ErrorBoundary>
              </div>
              {errors.about && (
                <label className="errorLbl">{errors.about}</label>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyProfile;
