import React, { useContext } from 'react';
import { Upload, Icon, message } from 'antd';
import UploadedImages from '../contexts/UploadedImages'
import useAxios from '../hooks/useAxios'
import useUrlBuilder from '../hooks/useUrlBuilder'

const { Dragger } = Upload;

const FileUpload = () => {
  const uploaded = useContext(UploadedImages)
  const { images, setUploadedImages } = uploaded

  const [ocrState, ocrSend] = useAxios({
    url: `images:annotate`,
    method:'POST'
  })

  const endpoint = "https://vision.googleapis.com/v1/images:annotate"

  const preFormat = (arr) =>{
    return [
      arr[0].x,
      arr[0].y,
      arr[1].x-arr[0].x,
      arr[3].y-arr[0].y
    ]
  }

  const tidyResults = (raw)=>{
    let results = {
        texts:[],
        boundings:[]
    }
    raw.map((item,index)=>{
      // console.log(item.description)
      // console.log(item.boundingPoly.vertices)
      if(index>0){
        results.texts.push(item.description)
        results.boundings.push(preFormat(item.boundingPoly.vertices))
      }
    })
    return results
  }

  const props = {
    name: 'file',
    multiple: true,
    accept: ".png,.jpeg,.jpg",
    showUploadList: false,
    beforeUpload:(file) => {
        const reader = new FileReader();

        reader.onload = e => {
            // console.log(e)
            const base64 = e.target.result.toString().replace(/^data:(.*,)?/, '')
            // images.push({
            //   base64,
            //   ocrResults:'',
            //   createdAt: new Date()
            // })
            // setUploadedImages((prev)=>({
            //   ...prev,
            //   images
            // }))
            ocrSend({
              url:endpoint,
              params:{
                key:"AIzaSyAU3BtmLPckd1-oj66CeZE86PaNqjAL5bY",
              },
              data:{
                requests:[
                  {
                    image:{
                      content:base64
                    },
                    features:[
                      {
                        type: "TEXT_DETECTION"
                      }
                    ]
                  }
                ]
              }
            },(res)=>{
              // console.log(tidyResults(res.responses[0].textAnnotations))
              console.log(res)
              setUploadedImages({images:{
                base64,
                ocrResultsRaw:res.responses[0],
                ocrResults:tidyResults(res.responses[0].textAnnotations),
                createdAt: new Date()
              }})
              // images.push({
              //   base64,
              //   ocrResultsRaw:res.responses[0],
              //   // ocrResults:tidyResults(res.responses[0].textAnnotations),
              //   createdAt: new Date()
              // })
              console.log(new Date())
              message.success(`file uploaded successfully.`);
            },(e)=>{
              console.log(e)
            })


        };
        reader.readAsDataURL(file);

        // Prevent upload
        return false;
    },
    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    // onChange(info) {
    //   const { status } = info.file;
    //   if (status !== 'uploading') {
    //     console.log(info.file, info.fileList);
    //   }
    //   if (status === 'done') {
    //     message.success(`${info.file.name} file uploaded successfully.`);
    //   } else if (status === 'error') {
    //     message.error(`${info.file.name} file upload failed.`);
    //   }
    // },
  };

  return (
    <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <Icon type="inbox" />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibit from uploading company data or other
      band files
    </p>
  </Dragger>
  )
}

export default FileUpload
