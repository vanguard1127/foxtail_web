import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { kinkOptions } from "../../../docs/options";
import Spinner from "../../common/Spinner";
import SearchBox from "./SearchBox";
import Tooltip from "./Tooltip/Tooltip";

class Kinks extends Component {
  state = { searchText: "" };
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    document.addEventListener("touchstart", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    document.removeEventListener("touchstart", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.wrapperRef && this.wrapperRef.current === event.target) {
      this.props.close();
    }
  };
  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.searchText !== nextState.searchText ||
      this.props.kinks !== nextProps.kinks ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }
  render() {
    const { searchText } = this.state;
    const {
      close,
      onChange,
      kinks,
      t,
      ErrorBoundary,
      tReady,
      isEvent
    } = this.props;
    if (!tReady) {
      return <Spinner />;
    }
    return (
      <section className="kinks-popup show" ref={this.wrapperRef}>
        <div className="modal-popup kinks-select">
          <ErrorBoundary>
            <div className="m-head">
              <span className="heading">
                {!isEvent ? t("kinkselect") : t("playselect")}
              </span>
              <span className="title">
                {!isEvent ? t("setkinks") : t("setplay")}
              </span>
              <span className="close" onClick={close} />
            </div>
            <div className="m-body kinks">
              <SearchBox value={searchText} onChange={this.setValue} t={t} />
              <div className="kinks-list-con">
                <ul>
                  {kinkOptions
                    .filter(kink =>
                      kink.label.toLowerCase().startsWith(searchText)
                    )
                    .map((option, index) => (
                      <li key={option.value}>
                        <Tooltip title={t(option.label)} placement={"top"}>
                          <input
                            type="checkbox"
                            id={option.value}
                            checked={
                              kinks.indexOf(option.value) > -1 ? true : false
                            }
                            onChange={e =>
                              onChange({
                                checked: e.target.checked,
                                value: option.value
                              })
                            }
                          />
                          <label htmlFor={option.value}>
                            <span />
                            <b>{t(option.label)}</b>
                          </label>
                        </Tooltip>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="scroll-more-down">{t("scroll")}</div>
          </ErrorBoundary>
        </div>
      </section>
    );
  }
}
export default withTranslation("modals")(Kinks);
