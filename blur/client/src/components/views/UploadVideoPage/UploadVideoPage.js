import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from "react-redux";
//import Axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;


const Private = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' }
]

const Catogory = [
  { value: 0, label: "Film & Animation" },
  { value: 0, label: "Autos & Vehicles" },
  { value: 0, label: "Music" },
  { value: 0, label: "Pets & Animals" },
  { value: 0, label: "Sports" },
]

function UploadVideoPage(props) {
  const user = useSelector(state => state.user);

  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState(0)
  const [Categories, setCategories] = useState("Film & Animation")
  const [FilePath, setFilePath] = useState("")
  const [Duration, setDuration] = useState("")
  const [Thumbnail, setThumbnail] = useState("")


  const handleChangeTitle = (event) => {
      setTitle(event.currentTarget.value)
  }

  const handleChangeDecsription = (event) => {
      console.log(event.currentTarget.value)

      setDescription(event.currentTarget.value)
  }

  const handleChangeOne = (event) => {
      setPrivacy(event.currentTarget.value)
  }

  const handleChangeTwo = (event) => {
      setCategories(event.currentTarget.value)
  }
  

  const onDrop = (files) => {

      let formData = new FormData();
      const config = {
          header: { 'content-type': 'multipart/form-data' }
      }
      console.log(files)
      formData.append("file", files[0])

      axios.post('/api/video/uploadfiles', formData, config)
          .then(response => {
              if (response.data.success) {

                  let variable = {
                      filePath: response.data.filePath,
                      fileName: response.data.fileName
                  }
                  setFilePath(response.data.filePath)

                  //gerenate thumbnail with this filepath ! 

                  axios.post('/api/video/thumbnail', variable)
                      .then(response => {
                          if (response.data.success) {
                              setDuration(response.data.fileDuration)
                              setThumbnail(response.data.thumbsFilePath)
                          } else {
                              alert('Failed to make the thumbnails');
                          }
                      })


              } else {
                  alert('failed to save the video in server')
              }
          })

  }

  return (
      <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Title level={2} > Upload Video</Title>
          </div>

          <Form onSubmit>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Dropzone
                      onDrop={onDrop}
                      multiple={false}
                      maxSize={800000000}>
                      {({ getRootProps, getInputProps }) => (
                          <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              {...getRootProps()}
                          >
                              <input {...getInputProps()} />
                              <Icon type="plus" style={{ fontSize: '3rem' }} />

                          </div>
                      )}
                  </Dropzone>

                  {Thumbnail !== "" &&
                      <div>
                          <img src={`http://localhost:5000/${Thumbnail}`} alt="haha" />
                      </div>
                  }
              </div>

              <br /><br />
              <label>Title</label>
              <Input
                  onChange={handleChangeTitle}
                  value={title}
              />
              <br /><br />
              <label>Description</label>
              <TextArea
                  onChange={handleChangeDecsription}
                  value={Description}
              />
              <br /><br />

              <select onChange={handleChangeOne}>
                  {Private.map((item, index) => (
                      <option key={index} value={item.value}>{item.label}</option>
                  ))}
              </select>
              <br /><br />

              <select onChange={handleChangeTwo}>
                  {Catogory.map((item, index) => (
                      <option key={index} value={item.label}>{item.label}</option>
                  ))}
              </select>
              <br /><br />

              <Button type="primary" size="large" onClick>
                  Submit
          </Button>

          </Form>
      </div>
  )
}

export default UploadVideoPage






/*
//옵션을 위한 key -val
const PrivateOptions = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' }
]

const CategoryOptions = [
  { value: 0, label: "Blur1" },
  { value: 0, label: "Blur2" },
  { value: 0, label: "Blur3" },
  { value: 0, label: "Blur4" },
  { value: 0, label: "Blur5" },
]


function VideoUploadPage() {

  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState(""); //처음은 빈 스트링
  const [Private, setPrivate] = useState(0) //퍼블릭은 1
  const [Category, setCategory] = useState("Blur1") //처음 state
  const [FilePath, setFilePath] = useState("")
  const [Duration, setDuration] = useState("")
  const [Thumbnail, setThumbnail] = useState("")

  //state바꿔줄때는 set 써진걸로 바꿔줄 수 있음
  //e = event
  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value)
  }

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value)
  }

  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value)
  }

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value)
  }

  //파라미터로 file 받음 -> 업로드 하는 file 정보들어있음
  const onDrop = (files) => {

    let formData = new FormData();
    const config = {
        header: { 'content-type': 'multipart/form-data' }
    }
    formData.append("file", files[0])
    //첫 번째꺼 가져오기위해 array
    //axios로 서버에 파일 보내기(req)
    //파일 보낼 때 헤더에 const 타입 해줘야 오류 안남

    //넣자마자 서버에 보내야하니까
    Axios.post('/api/video/uploadfiles', formData, config)
        .then(response => {
            //서버에서 처리한거 response로 가져오기
            //서버 라우터 routes->user.js
            if (response.data.success) { //파일경로url
              console.log(response.data)

              let variable = {
                //url:response.data.url, //서버에서 받은 data url
                //fileName:response.data.filename
                filePath: response.data.filePath,
                fileName: response.data.fileName
              }

              setFilePath(response.data.filePath)

              
              //variable 놓고 서버에 보내주기
              //'/api/video/thumbnail' 라우터 만들기 위해서 >> 비디오 라우터
              Axios.post('/api/video/thumbnail', variable)
                .then(response =>{ //서버에서 다 일어난 후 response 받아옴
                  if(response.data.success){
                    setDuration(response.data.fileDuration)
                    //생성한 썸네일 경로 state보내주고 저장
                    setThumbnail(response.data.thumbsFilePath)
                  }else{
                    alert('썸네일 생성에 실패 했습니다.')
                  }
                })


            } else {
                alert('failed to save the video in server')
            }
        })

  }


  return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > Upload Video</Title>
            </div>

            <Form onSubmit>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/*Drop zone()}
                    <Dropzone
                      onDrop={onDrop}
                      multiple={false}
                      //한번에 파일 여러개 올리는 거 방지ㅞㅡ
                      maxSize={800000000}
                    >  
                    {({ getRootProps, getInputProps }) => (
                        <div style={{ width: '300px', height: '240px', border: '1px solid lightgray',
                          display:'flex', alignItems: 'center', justifyContent: 'center' }}{...getRootProps()}>
                              <input {...getInputProps()} />
                              <Icon type="plus" style={{ fontSize: '3rem' }} />
                        </div>
                    )}
                    </Dropzone>

                    {Thumbnail !== "" &&
                        <div>
                            <img src={`http://localhost:5000/${Thumbnail}`} alt="Thumbnail" />
                        </div>
                    }
                </div>

                <br /><br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br /><br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br /><br />

                
                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                  //map사용시 key 항상 필요
                  ))}
                </select>
                <br /><br />

                <select onChange={onCategoryChange}> 
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.label}>{item.label}</option>
                    ))}
                </select>
                <br /><br />

                <Button type="primary" size="large" onClick>
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage
*/
