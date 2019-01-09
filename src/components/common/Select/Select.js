import React from "react";
import PropTypes from "prop-types";
import './Select.css'

class Select extends React.Component {

  static propTypes = {
    multiple: PropTypes.bool,
    label: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    defaultOptionValue: PropTypes.string, // should pass the value prop's value
    defaultOptionValues: PropTypes.array,
    onChange: PropTypes.func
  };

  constructor(props){
    super(props);
    this.selectContainerRef = React.createRef();
  }

  state = {
    menuOpen: false,
    selectedOption: this.props.options[0],
    selectListOffsetTop: 0,
    selectedOptions: [this.props.options[0]]
  }

  componentDidMount(){
    this.getDefaultOption();
    this.setState({selectListOffsetTop:  this.selectContainerRef.current.offsetTop + 48});
  }

  getDefaultOption = () => {
    if(this.props.multiple && this.props.defaultOptionValues){
      const defaultOptions = this.props.defaultOptionValues.map(d => {
        const found = this.props.options.find(x => x.value == d)
        if(found == undefined)
          throw('The default value you passed as props can not found in select options array');
        return found;
      })
      this.setState({selectedOptions: defaultOptions });
    }
    else if (this.props.defaultOptionValue){
      const foundOption = this.props.options.find(x => x.value == this.props.defaultOptionValue);
      if(foundOption){
        this.setState({ selectedOption: foundOption });
      }
    }
  }

  onSelect = (event,optionProps) => {
    if(!this.props.multiple){
      this.setState({selectedOption: optionProps, menuOpen: false}, () => {
        if(this.props.onChange)
          this.props.onChange(optionProps, event);
      });
    }
    else{
      let selectedOptionsCopy = [...this.state.selectedOptions];

      let isOptionExists = selectedOptionsCopy.find(x => x.value == optionProps.value) != undefined
      
      if(isOptionExists){
        selectedOptionsCopy = selectedOptionsCopy.filter(x => x.value != optionProps.value);
      }
      else{
        selectedOptionsCopy.push(optionProps);
      }
  
      this.setState({selectedOptions: selectedOptionsCopy, menuOpen: true}, () => {
        if(this.props.onChange)
          this.props.onChange(this.state.selectedOptions, event);
      });
    }
  }

  render() {
    const SelectList = () => (
        <div className="select-list" style={{top: this.state.selectListOffsetTop + 'px'}}>
        <ul>
          {this.props.options.map((d,i) => {
            let checked = false;
            if(this.props.multiple){
              checked = this.state.selectedOptions.find(x => x.value == d.value) != undefined
            }
            else{
              checked = this.state.selectedOption.value == d.value;
            }
            return (
              <li key={i} onClick={e => this.onSelect(e,d)} className={checked ? "checked" : ''}>
                {d.label}
              </li> 
            )
          })}
        </ul>
      </div>
    )
    return (
      <React.Fragment>      
        <div ref={this.selectContainerRef} className={'select-container ' + this.props.className || ''} onClick={() => this.setState({menuOpen: !this.state.menuOpen})}>
          <label>{this.props.label}</label>
          {this.props.multiple && 
            <div className="multiple-options">
              {this.state.selectedOptions.map(d => 
                <span>{d.label}</span>
              )}
            </div>
          }
          {!this.props.multiple && <span>{this.state.selectedOption.label}</span>}
          <div className="arrow"/>
        </div>
        {this.state.menuOpen && <SelectList/>}
      </React.Fragment>
    );
  }
}

export default Select;
