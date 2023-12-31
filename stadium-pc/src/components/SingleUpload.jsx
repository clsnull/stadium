/* eslint-disable react/prop-types */
import {
    policy
} from '@/api/oss'
import { message, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

function SingleUpload({ value, onChange }) {
    let [OSSData, setOSSData] = useState()
    const [fileList, setFileList] = useState([])

    async function beforeUpload(file) {
        if (!OSSData) return false;
        const expire = Number(OSSData.expire) * 1000
        if (expire < Date.now()) {
            await init();
        }
        const suffix = file.name.slice(file.name.lastIndexOf('.'));
        const filename = Date.now() + suffix;
        file.key = OSSData.dir + filename;
        file.url = OSSData.host + '/' + OSSData.dir + filename;
        return file;
    }

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList)
        if (newFileList.length !== 0) {
            onChange?.(newFileList[0].url);
        } else {
            onChange?.('')
        }
    }

    const onRemove = () => {
        onChange?.('');
    };

    function getExtraData(file) {
        return {
            key: file.key,
            OSSAccessKeyId: OSSData?.accessKeyId,
            policy: OSSData?.policy,
            Signature: OSSData?.signature,
        }
    }

    const init = async () => {
        try {
            const result = await policy();
            setOSSData(result.data);
        } catch (error) {
            message.error(error);
        }
    }
    useEffect(() => {
        init();
    }, [])
    useEffect(() => {
        if (!value) return
        setFileList([{
            url: value,
        }])
    }, [value])
    const uploadProps = {
        name: 'file',
        action: OSSData?.host,
        listType: 'picture-card',
        onChange: handleChange,
        onRemove,
        data: getExtraData,
        beforeUpload
    }
    const uploadButton = (
        <div>
            <PlusOutlined size={32} />
        </div>
    );
    return (
        <>
            <Upload {...uploadProps} fileList={fileList} maxCount={1}>
                {fileList.length >= 1 ? null : uploadButton}
            </Upload>
        </>
    )
}

export default SingleUpload