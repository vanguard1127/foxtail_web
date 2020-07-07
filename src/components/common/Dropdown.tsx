import React, { memo, useState, useEffect } from "react";

import Select from "./Select";

import { catchErrors } from "./ErrorHandler";

interface IDropdownProps {
  lang: string;
  onChange: (e: any) => void;
  value: string | string[];
  placeholder: string;
  type: string;
  className?: string;
  multiple?: boolean;
  onClose?: () => void;
}

const Dropdown: React.FC<IDropdownProps> = memo(({
  lang,
  onChange,
  value,
  placeholder,
  type,
  className = '',
  multiple = false,
  onClose,
}) => {
  const [options, setOptions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!options) {
      fetchData(lang);
    }
  }, [lang]);

  const getOptionsFromDictionary = (type, dictionary) => {
    switch (type) {
      case "sex":
        return dictionary.sexSingleOptions;
      case "lang":
        return dictionary.langOptions;
      case "sexuality":
        return dictionary.sexualityOptions;
      case "eventType":
        return dictionary.eventTypeOptions;
      case "payType":
        return dictionary.payTypeOptions;
      default:
        return dictionary.sexOptions;
    }
  }

  const getLang = (langSel: string): string => {
    const availLangs = process.env.REACT_APP_AVAIL_LANGUAGES_LIST || "en,de";
    if (!availLangs.includes(lang)) {
      return "en";
    }
    return langSel
  }

  const fetchData = (langSel: string) => {
    import("../../docs/options/" + getLang(langSel))
      .then(dictionary => {
        setOptions(getOptionsFromDictionary(type, dictionary));
        setIsLoading(false);
      })
      .catch(error => {
        catchErrors(error);
      });
  };

  if (isLoading || options === null) {
    return <div>Loading...</div>;
  }

  const defaultValues = !multiple
    ? { defaultOptionValue: value }
    : { defaultOptionValues: value.map(val => options.find(el => el.value === val)) }

  return (
    <Select
      onChange={onChange}
      onClose={onClose}
      multiple={multiple}
      label={placeholder}
      {...defaultValues}
      options={options}
      className={className}
    />
  );
});

export default Dropdown;
