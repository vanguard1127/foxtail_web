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
  message
} from "antd";
import axios from "axios";
import AddressSearch from "../common/AddressSearch";
import MultiSelectDropdown from "../MultiSelectDropdown";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { Mutation } from "react-apollo";
import { SIGNS3 } from "../../queries";

const FormItem = Form.Item;

const options = [
  { value: "cuddling", label: "Cuddling" },
  { value: "cooking", label: "Cooking" },
  { value: "dating", label: "Dating" },
  { value: "flirting", label: "Flirting" }
];
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
const AddEventModal = Form.create()(
  class extends React.Component {
    state = {
      address: "",
      lat: "",
      long: "",
      filename: "",
      filetype: "",
      photoUrl: "",
      eventname: "",
      image: "",
      description: "",
      type: "",
      time: "",
      sexes: [],
      desires: [],
      maxDistance: 50,
      eventID: null,
      validating: ""
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
      signS3().then(async ({ data }) => {
        const { signedRequest, key } = data.signS3;
        await this.uploadToS3(file, signedRequest);
        this.setState({
          photoUrl: key
        });
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
      console.log(this.props.form.getFieldValue("desires"));
    };

    handleSubmit = e => {
      e.preventDefault();

      this.props.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        console.log("VAL");
        // Should format date value before submit.
        const dateTimeValue = fieldsValue["date-time-picker"].format(
          "YYYY-MM-DD HH:mm a"
        );
        const values = {
          ...fieldsValue,
          dateTimeValue
        };
        console.log("Received values of form: ", values);
      });
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
        .catch(error => console.error("Error", error));
    };

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      const { filename, filetype, lat, long, validating, time } = this.state;

      return (
        <Modal
          visible={visible}
          title="Create a new event"
          okText="Create"
          onCancel={onCancel}
          onOk={() => onCreate({ lat, long, time })}
        >
          <Form layout="vertical">
            <FormItem label="Event Name" {...formItemLayout}>
              {getFieldDecorator("eventname", {
                rules: [
                  {
                    required: true,
                    message: "Please input the name of the event!"
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="Date/Time" {...formItemLayout}>
              {getFieldDecorator("date-time-picker", {
                rules: [
                  {
                    type: "object",
                    required: true,
                    message: "Please select time!"
                  }
                ]
              })(
                <DatePicker
                  showTime={{ use12Hours: true }}
                  format="YYYY-MM-DD HH:mm a"
                  onChange={this.handleDateTime}
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
                initialValue: this.props.form.address
                  ? this.props.form.address
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
              {getFieldDecorator("description")(<Input type="textarea" />)}
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
                <Mutation mutation={SIGNS3} variables={{ filename, filetype }}>
                  {(signS3, { data, loading, error }) => (
                    <Upload
                      disabled={
                        this.props.form.getFieldValue("upload") ? true : false
                      }
                      name="file"
                      action="//jsonplaceholder.typicode.com/posts/"
                      onChange={this.handlePhotoChange}
                      file={this.props.form.upload}
                      data={file => this.handleUpload(file, signS3)}
                    >
                      <Button>
                        <Icon type="upload" /> Click to Upload
                      </Button>
                    </Upload>
                  )}
                </Mutation>
              )}
            </FormItem>
            <FormItem label="For those interested in">
              {getFieldDecorator("desires", {
                initialValue: this.props.desires ? this.props.desires : []
              })(
                <MultiSelectDropdown
                  name="desires"
                  placeholder="Activities at the event..."
                  handleChange={this.handleChangeSelect}
                  options={options}
                  style={{ width: "100%" }}
                />
              )}
            </FormItem>
            <FormItem
              label="Visibility"
              className="collection-create-form_last-form-item"
            >
              {getFieldDecorator("modifier", {
                initialValue: "public"
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
    }
  }
);

export default AddEventModal;
