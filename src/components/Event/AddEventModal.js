import React from "react";
import {
  Modal,
  Form,
  Input,
  Radio,
  DatePicker,
  Upload,
  Button,
  Icon,
  message,
  Select
} from "antd";
import axios from "axios";
import AddressSearch from "../common/AddressSearch";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { Mutation } from "react-apollo";
import { SIGNS3, CREATE_EVENT, SEARCH_EVENTS } from "../../queries";
import moment from "moment";
import { desireOptions } from "../../docs/data";
import Error from "../common/Error";

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 }
  }
};

const initialState = {
  lat: "",
  long: "",
  filename: "",
  filetype: "",
  photoUrl: "",
  image: "",
  type: "",
  time: "",
  interestedIn: [],
  desires: [],
  validating: "",
  eventname: ""
};

const AddEventModal = Form.create()(
  class extends React.Component {
    state = {
      ...initialState
    };

    clearState = () => {
      this.setState({ desires: [] });
      // this.props.form.setFieldsValue({ upload: [] });
      // console.log(this.props.upload);
      // console.log(this.state.upload);
      // console.log(this.props.form.getFieldValue("upload"));
      this.setState(initialState);
      // this.props.form.setFieldsValue(initialFormState);
      this.props.form.resetFields();
    };

    handlePhotoChange = info => {
      if (info.fileList.length === 0) {
        this.props.form.resetFields("upload");
        message.success(`${info.file.name} file removed successfully.`);
        return;
      }
      if (info.file.status !== "uploading") {
        console.log("loading");
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }

      let file = info.file;

      if (file.response) {
        this.props.form.setFieldsValue({ upload: file });

        return file.response.status === "success";
      }
    };

    handleUpload = (file, signS3) => {
      this.setState({
        filename: file.name,
        filetype: file.type
      });
      //format name on backend
      //filename: this.formatFilename(file.name),
      signS3()
        .then(async ({ data }) => {
          const { signedRequest, key } = data.signS3;
          await this.uploadToS3(file, signedRequest);
          this.setState({
            photoUrl: key
          });
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    };

    handleDateTime = time => {
      this.setState({
        time
      });
    };

    normFile = e => {
      console.log("Upload event:", e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    };

    uploadToS3 = async (file, signedRequest) => {
      try {
        //ORIGINAL
        const options = {
          headers: {
            "Content-Type": file.type
          }
        };

        const resp = await axios.put(signedRequest, file, options);
        if (resp.status === 200) {
          console.log("upload ok");
        } else {
          console.log("Something went wrong");
        }
      } catch (e) {
        console.log(e);
      }
    };

    handleChangeSelect = value => {
      this.props.form.setFieldsValue({ desires: value });
    };

    handleSelect = address => {
      geocodeByAddress(address)
        .then(results => {
          return getLatLng(results[0]);
        })
        .then(latLng => {
          this.setState({
            lat: latLng.lat,
            long: latLng.lng,
            validating: "success"
          });
          this.props.form.setFieldsValue({
            address
          });
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    };

    closeModal = onCancel => {
      this.clearState();
      onCancel();
    };
    disabledDate = current => {
      // Can not select days before today and today
      return current && current < moment().endOf("day");
    };

    render() {
      const {
        visible,
        onCancel,
        form,
        event,
        handleSubmit,
        handleUpdate
      } = this.props;
      const { getFieldDecorator } = form;
      const { filename, filetype, lat, long, validating, time } = this.state;
      const {
        eventname,
        desires,
        interestedIn,
        description,
        address,
        type
      } = this.props.form.getFieldsValue();
      const queryParams = JSON.parse(
        sessionStorage.getItem("searchEventQuery")
      );
      //This ensures null event doesnt get checked
      let selectedEvent = event ? event : {};
      return (
        <Mutation
          mutation={CREATE_EVENT}
          variables={{
            eventname,
            desires,
            interestedIn,
            description,
            address,
            type,
            lat: lat ? lat : selectedEvent.lat,
            long: long ? long : selectedEvent.long,
            time: time ? moment(time).toISOString() : selectedEvent.time,
            eventID: selectedEvent.id
          }}
          update={handleUpdate}
          refetchQueries={() => [
            {
              query: SEARCH_EVENTS,
              variables: { ...queryParams }
            }
          ]}
        >
          {(createEvent, { loading }) => {
            return (
              <Modal
                visible={visible}
                title={event ? "Update Event" : "Create a New Event"}
                okText="Create"
                onCancel={() => this.closeModal(onCancel)}
                onOk={e => handleSubmit(e, createEvent)}
                okButtonProps={{ disabled: loading }}
              >
                <Form layout="vertical">
                  <FormItem label="Event Name" {...formItemLayout}>
                    {getFieldDecorator("eventname", {
                      rules: [
                        {
                          whitespace: true,
                          required: true,
                          message: "Please input the name of the event!"
                        },
                        {
                          min: 3,
                          max: 100,
                          message:
                            "Please keep your title between 3 and 100 characters."
                        }
                      ],
                      initialValue: selectedEvent.eventname
                        ? selectedEvent.eventname
                        : ""
                    })(<Input />)}
                  </FormItem>
                  <FormItem label="Date/Time" {...formItemLayout}>
                    {getFieldDecorator("time", {
                      rules: [
                        {
                          type: "date",
                          required: true,
                          message: "Please select time!"
                        }
                      ],
                      initialValue: selectedEvent.time
                        ? moment(selectedEvent.time, "YYYY-MM-DD HH:mm a")
                        : null
                    })(
                      <DatePicker
                        showTime={{ use12Hours: true }}
                        format="YYYY-MM-DD HH:mm a"
                        onChange={this.handleDateTime}
                        disabledDate={this.disabledDate}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    label="Address"
                    {...formItemLayout}
                    validateStatus={validating}
                    help={
                      validating === "validating"
                        ? "Please choose an address from the list"
                        : ""
                    }
                  >
                    {getFieldDecorator("address", {
                      initialValue: selectedEvent.address
                        ? selectedEvent.address
                        : "",
                      rules: [
                        {
                          required: true,
                          message: "Please input the address of the event!"
                        }
                      ]
                    })(
                      <AddressSearch
                        style={{ width: "100%" }}
                        onSelect={this.handleSelect}
                        onChange={value => {
                          if (value.length > 3)
                            this.setState({ validating: "validating" });
                          this.props.form.setFieldsValue({ address: value });
                        }}
                      />
                    )}
                  </FormItem>
                  <FormItem label="Description" {...formItemLayout}>
                    {getFieldDecorator(
                      "description",
                      {
                        rules: [
                          {
                            max: 5000,
                            message:
                              "Please keep your description under 5000 characters"
                          }
                        ]
                      },
                      {
                        initialValue: selectedEvent.description
                          ? selectedEvent.description
                          : ""
                      }
                    )(<TextArea rows={4} />)}
                  </FormItem>
                  <FormItem
                    label="Image"
                    extra="Image for Event banner. Best size: 34x129 px"
                    {...formItemLayout}
                  >
                    {getFieldDecorator("upload", {
                      valuePropName: "file",
                      getValueFromEvent: this.normFile
                    })(
                      <Mutation
                        mutation={SIGNS3}
                        variables={{ filename, filetype }}
                      >
                        {(signS3, { loading, error }) => {
                          if (error) {
                            return <Error error={error} />;
                          }
                          return (
                            <Upload
                              disabled={
                                this.props.form.getFieldValue("upload")
                                  ? true
                                  : false
                              }
                              name="file"
                              action="//jsonplaceholder.typicode.com/posts/"
                              onChange={this.handlePhotoChange}
                              file={this.props.form.upload}
                              data={file => this.handleUpload(file, signS3)}
                            >
                              <Button disabled={loading}>
                                <Icon type="upload" /> Click to Upload
                              </Button>
                            </Upload>
                          );
                        }}
                      </Mutation>
                    )}
                  </FormItem>
                  <FormItem label="For those interested in">
                    {getFieldDecorator("desires", {
                      initialValue: selectedEvent.desires
                        ? selectedEvent.desires
                        : []
                    })(
                      <Select
                        mode="multiple"
                        placeholder="Activities at the event..."
                        style={{ width: "100%" }}
                        onChange={this.handleChangeSelect}
                        currentvalue={this.props.form.getFieldValue("desires")}
                      >
                        {desireOptions.map(option => (
                          <Option key={option.value}>{option.label}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label="Type"
                    className="collection-create-form_last-form-item"
                  >
                    {getFieldDecorator("type", {
                      initialValue: selectedEvent.type
                        ? selectedEvent.type
                        : "public"
                    })(
                      <Radio.Group
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Radio value="public">Public</Radio>
                        <Radio value="private">Private</Radio>
                        <Radio value="request">Request</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Form>
              </Modal>
            );
          }}
        </Mutation>
      );
    }
  }
);

export default AddEventModal;
