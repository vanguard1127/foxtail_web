import React, { useRef, useState, useEffect, memo } from "react";
import { withTranslation, WithTranslation } from "react-i18next";

import "./Select.css";

interface ISelectProps extends WithTranslation {
  label: string;
  options: Array<any>;
  onChange: (val: any) => void;
  onClose?: () => void;
  defaultOptionValue?: string | string[];
  defaultOptionValues?: Array<any>;
  multiple?: boolean;
  className?: string;
}

const Select: React.FC<ISelectProps> = memo(({
  label,
  options,
  defaultOptionValue = null,
  defaultOptionValues = [],
  onClose = null,
  multiple,
  onChange,
  className = '',
  t,
}) => {
  const scrollPosition = useRef(0);
  const selectContainerRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLUListElement>(null);

  const [state, setState] = useState({
    menuOpen: false,
    selectedOption: defaultOptionValue,
    selectedOptions: defaultOptionValues
  });

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, false);
    document.addEventListener("touchstart", handleClickOutside, false);
    if (defaultOptionValue) {
      setState({
        ...state,
        selectedOption: options.find(
          x => x.value == defaultOptionValue
        )
      });
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, false);
      document.removeEventListener("touchstart", handleClickOutside, false);
    }
  }, []);

  useEffect(() => {
    if (listContainerRef && listContainerRef.current) {
      scrollPosition.current = listContainerRef.current.scrollTop;
    }
  })

  const handleClickOutside = event => {
    if (state.menuOpen) {
      if (selectContainerRef.current && !selectContainerRef.current.contains(event.target)) {
        setState({ ...state, menuOpen: false })
        if (onClose) {
          onClose();
        }
      }
    }
  };

  const onSelect = (event, optionProps) => {
    if (!multiple) {
      setState({ ...state, selectedOption: optionProps, menuOpen: false })
      if (onChange) {
        onChange(optionProps, event);
      }
    } else {
      let selectedOptionsCopy = [...state.selectedOptions];

      let isOptionExists =
        selectedOptionsCopy.find(x => x.value === optionProps.value) !==
        undefined;

      if (isOptionExists) {
        selectedOptionsCopy = selectedOptionsCopy.filter(
          x => x.value !== optionProps.value
        );
      } else {
        selectedOptionsCopy = [...selectedOptionsCopy, optionProps];
      }
      console.log('selected options copy: ', selectedOptionsCopy)
      setState({ ...state, selectedOptions: selectedOptionsCopy, menuOpen: true })
      if (onChange) onChange(selectedOptionsCopy, event);
    }
    setState({ ...state, menuOpen: false })
  };

  const toggleDropdown = e => {
    if (multiple && e.target.tagName === "LI") {
      setState({ ...state, menuOpen: true });
      return;
    }
    if (state.menuOpen && onClose) {
      onClose();
    }
    setState({ ...state, menuOpen: !state.menuOpen });
  };

  const optionCounter = state.selectedOptions ? state.selectedOptions.length : 0;

  console.log('state.selectedOptions: ', state.selectedOptions);
  return (
    <React.Fragment>
      <div
        className={`select-container ${className} ${state.menuOpen ? "open" : ""}`}
        onClick={toggleDropdown}
        ref={selectContainerRef}
      >
        <label>{label}</label>
        {multiple && (
          <div className="multiple-options">
            {state.selectedOptions.length > 0 ? (
              state.selectedOptions.map((d, idx, arr) => {
                if (idx === arr.length - 1) {
                  return <span key={Math.random()}>{t(d.label)}</span>;
                }
                return <span key={Math.random()}>{t(d.label) + ","}</span>;
              })
            ) : (
                <span key={Math.random()}>{""}</span>
              )}
          </div>
        )}
        {multiple && optionCounter > 0 && (
          <span className="option-counter">{`(${optionCounter})`}</span>
        )}
        {!multiple && state.selectedOption && <span>{state.selectedOption.label}</span>}

        {state.menuOpen ?
          (
            <div className={multiple ? "select-list multiple" : "select-list"}>
              <ul ref={listContainerRef}>
                {options.map(d => {
                  let checked = false;
                  if (multiple) {
                    checked = state.selectedOptions.find(x => x.value == d.value) != undefined;
                  }
                  return (
                    <li
                      key={Math.random()}
                      onClick={e => onSelect(e, d)}
                      className={checked ? "checked" : ""}
                    >
                      {t(d.label)}
                    </li>
                  );
                })}
              </ul>
            </div>
          )
          : null}
      </div>
    </React.Fragment>
  );
});

export default withTranslation("common")(Select);
