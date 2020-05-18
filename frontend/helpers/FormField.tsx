import React, { useState, useRef } from "react";
import cn from "classnames";
import { get, map, find } from 'lodash';
import * as yup from "yup";
import { Form, Alert, 
  InputGroup, ButtonGroup, Button,
  OverlayTrigger, Tooltip } from "react-bootstrap";
import { FormikProps } from "formik";
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import NumberFormat from 'react-number-format';
import "../styles/float-labels.css";
import axios from "../utils/axios";
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTimesCircle,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'

/*interface FormFieldProps<TFormSchema, TKey extends keyof TFormSchema & string> extends FormikProps<TFormSchema> {
  label?: string;
  type?: string;
  placeholder?: string;
  id?: string;
  name: TKey;
  value?: string;
  error?: string;
  as?: React.ReactType;
  renderControl?: (controlProps: IControlProps<TFormSchema, TKey>) => React.ReactChild;
  renderErrors?: (errorProps: IControlProps<TFormSchema, TKey>) => React.ReactChild;
  hasFloatingLabel?: boolean;
  validationSchema?: yup.ObjectSchema;
  submissionErrors?: string[];
  readOnly?: boolean;
}*/

{/*interface IControlProps<TFormSchema, TKey extends keyof TFormSchema & string> extends FormFieldProps<TFormSchema, TKey> {
  value?: TFormSchema[TKey];
  error?: string;
  submissionErrors?: string[];
}*/}

export function FormField(props: any) {
  const value: any = typeof props.values != 'undefined' ? props.values[props.name] : (typeof props.value != 'undefined' ? props.value : "");
  const error: any = typeof props.errors != 'undefined' ? props.errors[props.name] : null;
  const submissionError: any = typeof props.submissionErrors != 'undefined' && props.submissionErrors  ? props.submissionErrors[props.name] : null;
  const readOnly: boolean = typeof props.readOnly != 'undefined' ? props.readOnly : false;
  const field = get(props.validationSchema, ['fields', props.name]);
  //const fieldDescription = (typeof field != 'undefined' && typeof field!.describe != 'undefined') ? (field && field.describe()) : null;
  const label = props.label;// || (fieldDescription && fieldDescription!.label);
  const isInvalid = ((props.touched[props.name] || props.submitCount) && (error || submissionError))

  const renderControlWithPrepend = (props) => {
    return (
      <InputGroup className={"mb-3 " + (isInvalid ? "is-invalid" : "")}>
        <InputGroup.Prepend>
          <InputGroup.Text>{props.inputGroupText}</InputGroup.Text>
        </InputGroup.Prepend>
        {renderControl(props)}
      </InputGroup>
    )
  }

  const renderControlCheck = (props) => {
    const initialValue = get(props.initialValues, props.name) ? props.initialValues[props.name] : "";
    return (
      <Form.Group controlId={`form-field-${props.name}`}>
        <Form.Check
          type="checkbox" 
          id={`form-field-${props.name}`}
          className="custom-control custom-checkbox mb-3"
          name={props.name}
          value={props.value}
        >
          <Form.Check.Input 
            onChange={(e) => {
              props.setFieldValue(props.name, e.target.checked);
              if(typeof props.handleCheckChange !== 'undefined' && props.handleCheckChange){
                props.handleCheckChange(e);
              }
            }}
            onBlur={props.handleBlur} 
            type="checkbox" 
            className="custom-control-input" 
          />
          <Form.Check.Label className="custom-control-label">
            <p>{props.label}</p>
          </Form.Check.Label>
        </Form.Check>
      </Form.Group>
    )
  }

  const renderControlRadio = (props) => {
    return (
      <div key="custom-inline-checkbox" className="mt-2">
      { map(props.checkValues, checkValue => (
        <Form.Check
          key={checkValue.value}
          inline
          type="radio"
          label={checkValue.label}
          name={props.name}
          value={checkValue.value}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          checked={ value == checkValue.value ? true : false }
        />
      )) }
      </div>
    )
  }

  const renderControlRadioButtons = (props) => {
    const initialValue = get(props.initialValues, props.name) ? props.initialValues[props.name] : "";
    const [radioValue, setRadioValue] = useState(initialValue);
    return (
      <>
      <ButtonGroup className="d-block btn-radio-group"> 
      { map(props.checkValues, checkValue => (
        <Button disabled={typeof props.isDisabled !== 'undefined' && props.isDisabled} style={ props.stretchToRow && {width: '50%'}} variant={ checkValue.value == radioValue ? "primary" : "secondary" } key={checkValue.value} onClick={ (e) => {
            setRadioValue(checkValue.value);
            props.setFieldValue(props.name, checkValue.value);
            if(typeof props.onChange !== 'undefined' && props.onChange)
              props.onChange(checkValue.value);
          } }
        >
          {checkValue.label}
        </Button>
      )) }
      </ButtonGroup>
      <input type="hidden" className={isInvalid ? "form-control is-invalid" : ""} name={props.name} value={radioValue} />
      </>
    )
  };

  const renderControlSelect = (props) => {
    return (
      <Form.Control 
        as="select" 
        name={props.name}
        onChange={props.handleChange}
        onBlur={props.handleBlur}
        isInvalid={isInvalid}
      >
      { map(props.selectValues, selectValue => (
        <option key={selectValue.value} value={selectValue.value}>{selectValue.label}</option>
      )) }
      </Form.Control>
    )
  }

  const renderControlSelectAlt = (props) => {
    const initialValue = (typeof props.initialValues[props.name] !== 'undefined') ? props.initialValues[props.name] : [];
    const initialOption = find(props.selectValues, ['value', initialValue]);
    return (
      <Select
        name={props.name}
        defaultValue={initialOption}
        options={props.selectValues}
        isSearchable={props.isSearchable}
        isClearable={props.isClearable}
        classNamePrefix="select"
        className={"select-container input-group " + (isInvalid ? "is-invalid" : "")}
        loadOptions={props.loadOptions}
        placeholder={props.placeholder}
        onChange={(selectedOption: any) => {
          props.setFieldValue(props.name, selectedOption ? selectedOption.value : null);
        }}
        {...props}
      />
    )
  }

  const renderControlSelectAsync = (props) => {
    const initialValue = get(props.initialValues, props.name) ? props.initialValues[props.name] : [];
    return (
      <AsyncSelect
        name={props.name}
        defaultValue={props.defaultValue}
        defaultOptions={props.selectValues}
        classNamePrefix="select"
        className={"select-container input-group " + (isInvalid ? "is-invalid" : "")}
        isClearable={props.isClearable}
        loadOptions={props.loadOptions}
        placeholder={props.placeholder}
        onChange={(selectedOption: any) => {
          props.setFieldValue(props.name, selectedOption ? selectedOption.value : null);
          if(typeof props.onChange !== 'undefined' && props.onChange){
            props.onChange(selectedOption);
          }
        }}
      />
    )
  }

  const renderControlMultiSelect = (props) => {
    const initialValue = get(props.initialValues, props.name) ? props.initialValues[props.name] : [];
    return (
      <Select
        isMulti
        defaultValue={initialValue}
        name={props.name}
        options={props.selectValues}
        classNamePrefix="select"
        placeholder={props.placeholder}
        onChange={(selectedOption: any) => {
          props.setFieldValue(props.name, selectedOption ? selectedOption.value : []);
        }}
      />
    )
  }

  const renderControlMultiSelectAsync = (props) => {
    const initialValue = get(props.initialValues, props.name) ? props.initialValues[props.name] : [];
    return (
      <AsyncSelect
        isMulti
        name={props.name}
        defaultValue={initialValue}
        defaultOptions={props.selectValues}
        options={props.selectValues}
        classNamePrefix="select"
        loadOptions={props.loadOptions}
        placeholder={props.placeholder}
        onChange={(selectedOption: any) => {
          if(selectedOption){
            const currentOptions = selectedOption.flatMap((opt) => {
              return opt.value;
            });
            props.setFieldValue(props.name, currentOptions);
          } else {
            props.setFieldValue(props.name, []);
          }
        }}
      />
    )
  };

  const renderControlFileUpload = (props) => {
    if(value){
      return (
        <div className="filepond--div initial">
          <a onClick={
            (e) => {
              props.setFieldValue(props.name, null);
            }
          }>
            <FontAwesomeIcon className="btn-icon" icon={faTimesCircle}  />
          </a>
          <label>{value}</label>
        </div>
      )
    }
    return (
      <div className={"filepond--div " + (isInvalid ? "is-invalid" : "")}>
        <FilePond
          name={props.name}
          allowMultiple={false}
          labelFileProcessingError={ (error) => {
            return error.body;
          }}
          server={{
            timeout: props.timeout, // in milliseconds?
            process: (fieldName, file, metadata, load, error, progress, abort) => {
              console.log(metadata);
              console.log(file);
              const returnObj = {
                abort: () => {
                    source.cancel('Operation canceled by the user.')
                    abort()
                }
              };
              if(!props.fileTypes.includes(file.type)){
                error('Invalid file type');
                return returnObj;
              }
              if(file.size > (props.fileSize * 1000000) ){
                error('File size exceeded: ' + String(props.fileSize) +' MB');
                return returnObj;
              }
              const formData = new FormData()
              formData.append(props.name, file, file.name)

              // aborting the request
              const CancelToken = axios.CancelToken
              const source = CancelToken.source()

              axios({
                method: 'POST',
                url: props.uploadUrl,
                data: formData,
                cancelToken: source.token,
                onUploadProgress: (e) => {
                    // updating progress indicator
                    progress(e.lengthComputable, e.loaded, e.total)
                }
              }).then(response => {
                  load(file.name);
                  props.setFieldValue(props.name, file.name);
              }).catch((e) => {
                  const messages = get(e, "response.data.errors.general") || [e.message];
                  if (axios.isCancel(e)) {
                      console.log('Request canceled', messages)
                  } else {
                    if(messages.length)
                      error(messages[0]);
                    else
                      error('Error uploading the file. Please try again.');
                  }
              })
              return returnObj;
            }
          }}
        />
      </div>
    );
  };

  const renderControl = (props) => {
    if(props.as == "amount") {
      return (
        <NumberFormat
          name={props.name}
          placeholder={props.placeholder}
          defaultValue={value}
          displayType={'input'} 
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
          className={"form-control " + (props.isBold ? "bold " : "") + (isInvalid ? "is-invalid" : "")}
          id={"form-field-" + props.name }
          onValueChange={(values) => { props.setFieldValue(props.name, values.value) }}
          onBlur={props.handleBlur}
        />
      )
    } else if(props.as == "number") {
      return (
        <NumberFormat
          name={props.name}
          placeholder={props.placeholder}
          defaultValue={value}
          displayType={'input'}
          prefix={props.prefix}
          format={props.format}
          allowLeadingZeros={props.allowLeadingZeros ? (typeof props.allowLeadingZeros !== 'undefined') : false}
          thousandSeparator={props.thousandSeparator}
          decimalScale={props.decimalScale}
          fixedDecimalScale={props.fixedDecimalScale}
          className={"form-control " + (props.isBold ? "bold " : "") + (isInvalid ? "is-invalid" : "")}
          id={"form-field-" + props.name }
          onValueChange={(values) => { props.setFieldValue(props.name, values.value) }}
          onBlur={props.handleBlur}
        />
      )
    } else {
      return (
        <Form.Control
          as={props.as}
          type={props.type}
          name={props.name}
          disabled={typeof props.isDisabled !== 'undefined' && props.isDisabled}
          placeholder={props.placeholder}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          defaultValue={value}
          label={label}
          readOnly={readOnly}
          isInvalid={isInvalid}
          plaintext={props.plaintext}
        />
      )
    }
  }

  var controlPresenter = null;
  if(props.renderControl) {
    controlPresenter = props.renderControl(props, isInvalid);
  } else if(props.inputGroup == "prepend"){
    controlPresenter = renderControlWithPrepend(props);
  } else if(props.as == "checkbox") {
    controlPresenter = renderControlCheck(props);
  } else if(props.as == "radio") {
    controlPresenter = renderControlRadio(props);
  } else if(props.as == "radio-buttons") {
    controlPresenter = renderControlRadioButtons(props);
  } else if(props.as == "select") {
    controlPresenter = renderControlSelect(props);
  } else if(props.as == "select-alt") {
    controlPresenter = renderControlSelectAlt(props);
  } else if(props.as == "select-async") {
    controlPresenter = renderControlSelectAsync(props);
  } else if(props.as == "multi-select") {
    controlPresenter = renderControlMultiSelect(props);
  } else if(props.as == "multi-select-async") {
    controlPresenter = renderControlMultiSelectAsync(props);
  } else if(props.as == "file-upload") {
    controlPresenter = renderControlFileUpload(props);
  } else {
    controlPresenter = renderControl(props);
  }

  return (
    <Form.Group
      controlId={`form-field-${props.name}`}
      as={props.groupAs}
      md={props.groupMd}
      sm={props.groupSm}
      className={props.className}
    >
      {(!props.hideLabel && props.as != "checkbox") && (
        <>
          <Form.Label>{label}</Form.Label>
          {props.tooltip && (
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="tooltip-right-${props.name}">
                  {props.tooltip}
                </Tooltip>
              }
            >
              <FontAwesomeIcon className="ml-2" style={{ fontSize: '0.9rem' }} icon={faQuestionCircle} />
            </OverlayTrigger>
          )}
        </>
      )}
      
      {controlPresenter}
      { (props.text) && <Form.Text className="text-muted">{props.text}</Form.Text>}
      
      <Form.Control.Feedback type="invalid">
        {error ? error : submissionError}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
