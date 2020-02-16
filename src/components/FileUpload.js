import React, { useContext } from 'react';
import { Upload, Icon, message } from 'antd';
import UploadedImages from '../contexts/UploadedImages'
import useAxios from '../hooks/useAxios'
import useUrlBuilder from '../hooks/useUrlBuilder'
import { vision } from '../env'
const { Dragger } = Upload;

const FileUpload = () => {
  const uploaded = useContext(UploadedImages)
  const { loading, setUploadedImages } = uploaded

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
      if(index>0){
        results.texts.push(item.description)
        results.boundings.push(preFormat(item.boundingPoly.vertices))
      }
    })
    return results
  }

  const messageKey = 'loadingMsg';

  const onLoading = () => {
      message.loading({
        content:'Analyzing image..',
        duration:0,
        key:messageKey
      });
  };

  const props = {
    name: 'file',
    multiple: false,
    accept: ".png,.jpeg,.jpg",
    showUploadList: false,
    disabled: loading,
    beforeUpload:(file) => {
        onLoading(true)
        // onLoading(false)

        setUploadedImages({
          loading:true
        })
        const reader = new FileReader();

        reader.onload = e => {
            const base64 = e.target.result.toString().replace(/^data:(.*,)?/, '')
            ocrSend({
              url:endpoint,
              params:{
                key:vision.api_key,
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
              console.log(res)
              setUploadedImages({
                loading:false,
                base64,
                ocrResultsRaw:res.responses[0],
                ocrResults:tidyResults(res.responses[0].textAnnotations),
                createdAt: new Date()
              })
              console.log(new Date())
              message.success({
                content:`action done successfully.`,
                key:messageKey
              });
            },(e)=>{
              console.log(e)
              setUploadedImages({
                loading:false
              })
              message.error({
                content:`Ops, Something wrong`,
                key:messageKey
              });
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
    <p className="ant-upload-text">Click or drag image to this area to start analyze</p>
    <p className="ant-upload-hint">
      Only accept jpeg,jpg and png files.
    </p>
  </Dragger>
  )
}

export default FileUpload
