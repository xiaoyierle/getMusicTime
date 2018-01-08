import React, {Component} from 'react';
import Home from '../home/home';
import '../../assets/css/add_demand_list.css';
import {Form, Icon, Input, Button, message, Upload, DatePicker, InputNumber, Row, Col} from 'antd';
import {Redirect} from 'react-router-dom';
import commonJs from '../common/common';
import GetAllTime from '../common/GetAllTime';
const FormItem = Form.Item;
const {TextArea} = Input;
message.config({
    duration: 5
});
class AddDemandListBox extends Component {
    constructor() {
        super();
        this.state = {
            redirect: '',
            url: '',
            allTime: ''
        };
    }
    submit(status) {
        this.props.form.validateFields((err, value) => {
            if (!err) {
                value.endTime = value.endTime.format('YYYY-MM-DD HH:mm:ss');
                value.accessory = this.state.url ? this.state.url : '未上传';
                value.status = status;
                value.allTime = this.state.allTime;
                fetch('/platform/admin/demand/service/save', {
                    method: 'post',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(value)
                }).then(res => res.json())
                    .then(data => {
                        if (data.code === '200') {
                            this.setState({
                                redirect: '/wplatform/demand/demand_list/'
                            });
                        }
                        else {
                            message.error(data.message);
                        }
                    });
            }
        });
    }
    setSet(obj) {
        this.setState({allTime: obj})
    }
    render() {
        const getFieldDecorator = this.props.form.getFieldDecorator;
        const props = {
            name: 'file',
            action: '/platform/uploadAudio',
            headers: {
                authorization: 'authorization-text'
            },
            withCredentials: true,
            udata: (data) => {this.setState({url: data})},
            onChange(info) {
                let res = info.file.response ? info.file.response : '';
                let code = res ? res.code : '';
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (code === '200') {
                    message.success(`${info.file.name} 操作成功`);
                    this.udata(info.file.response.data)
                }
                else if (code !== '200') {
                    if (code !== "") {
                        message.error(`${info.file.name} 操作失败.`);
                    }
                }
            }
        };
        return (
            <div>
                <Row>
                    <Col className="title-top">
                        <h2 className="team-title">需求单信息</h2>
                    </Col>
                </Row>
                <Form onSubmit={(e)=>{e.preventDefault()}}>
                    <FormItem label="需求名称" {...style}>
                        {
                            getFieldDecorator('name', {
                                rules: [{required: true}]
                            })(
                                <Input autoComplete="off"/>
                            )
                        }
                    </FormItem>
                    <FormItem label="需求人" {...style}>
                        {
                            getFieldDecorator('clientName', {
                                rules: [{required: true}]
                            })(
                                <Input autoComplete="off"/>
                            )
                        }
                    </FormItem>
                    <div className="line"></div>
                    <Row>
                        <Col className="title-top">
                            <h2 className="team-title">需求人信息</h2>
                        </Col>
                    </Row>
                    <FormItem label="联系方式" {...style}>
                        {
                            getFieldDecorator('clientTel', {
                                rules: [{required: true, message: '请填写联系方式'}, {validator: this.validTel}]
                            })(
                                <Input autoComplete="off"/>
                            )
                        }
                    </FormItem>
                    <FormItem label="需求金额" {...style}>
                        {
                            getFieldDecorator('money', {
                                rules: [{required: true, message: '请输入需求金额'}]
                            })(
                                <InputNumber autoComplete="off"
                                   formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                   parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                     min={0} max={10000000}
                                     precision={2}
                                             style={{width: '100%'}}
                                />
                            )
                        }
                    </FormItem>
                    <div className="line"></div>
                    <Row>
                        <Col className="title-top">
                            <h2 className="team-title">需求单要求</h2>
                        </Col>
                    </Row>
                    <FormItem label="需求截止时间" {...style}>
                        {
                            getFieldDecorator('endTime', {
                                rules: [{required: true}]
                            })(
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="选择时间"
                                    style={{width: '100%'}}
                                />
                            )
                        }
                    </FormItem>
                    <FormItem label="需求附件" {...style}>
                        {
                            getFieldDecorator('accessory', {
                                rules: []
                            })(
                                <Upload {...props}>
                                    <Button>
                                        <Icon type="upload" />
                                        点击上传
                                    </Button>
                                </Upload>
                            )
                        }
                    </FormItem>
                    <GetAllTime src={this.state.url} id="ceshi" setSet={this.setSet.bind(this)}/>
                    <FormItem label="描述" {...style}>
                        {
                            getFieldDecorator('description', {
                                rules: [{required: true}]
                            })(
                                <TextArea autoComplete='off' autosize={{ minRows: 8, maxRows: 8 }}/>
                            )
                        }
                    </FormItem>
                    <FormItem wrapperCol={{offset: 7, span: 10}}>
                        <div className="buttonBox">
                            <Button type="primary" ghost htmlType="submit" onClick={() => this.submit(1)}>
                                暂存
                            </Button>
                            <Button type="primary" ghost htmlType="submit" onClick={() => this.submit(2)}>
                                发布
                            </Button>
                            <Button type="default" htmlType="submit" onClick={() => commonJs.goBack()}>
                                取消
                            </Button>
                        </div>
                    </FormItem>
                </Form>
            </div>
        );
    }
}
const AddForm = Form.create()(AddDemandListBox);
class AddDemandList extends Component {
    render() {
        const bread = {
            bread: [{name: '需求单管理', url: '/wplatform/demand/demand_list'}, {name: '新增需求单', url: '/wplatform/user/team_dubbing'}],
            name: '新增需求单'
        };
        return (
            <Home selected="demand_list" openkeys='demand' bread={bread}>
                <div className="add-demand-list">
                    <AddForm/>
                </div>
            </Home>
        );
    }
}
export default AddDemandList;
