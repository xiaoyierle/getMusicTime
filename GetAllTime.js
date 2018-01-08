import React, { Component } from 'react';
class Audio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allTime: 0, // 总时长
        };
    }
    millisecondToDate(time) {
        const second = Math.floor(time % 60);
        let minite = Math.floor(time / 60);
        let hour
        if(minite > 60) {
          hour = minite / 60
          minite = minite % 60
          return `${Math.floor(hour)}:${Math.floor(minite)}:${Math.floor(second)}`
        }
        return `${minite}:${second >= 10 ? second : `0${second}`}`;
    }
    controlAudio(type, value) {
        const {id} = this.props;
        const audio = document.getElementById(`audio${id}`);
        this.setState({
            allTime: audio.duration
        });
        this.props.setSet(audio.duration);
    }
    render() {
        return (
            <div className="audioBox">
                <audio
                    id={`audio${this.props.id}`}
                    src={this.props.src}
                    preload="true"
                    onCanPlay={() => this.controlAudio()}
                    style={{display: 'none'}}
                >
                    您的浏览器不支持 audio 标签。
                </audio>
            </div>
        );
    }
}
export default Audio;
