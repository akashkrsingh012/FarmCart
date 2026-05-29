import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError';

const EditCategory = ({ close, fetchData, data: CategoryData }) => {
    const [data, setData] = useState({
        _id: CategoryData._id,
        name: CategoryData.name,
        image: CategoryData.image,
        imageUrl: CategoryData.imageUrl
    })
    const [loading, setLoading] = useState(false)
    const [fileSelected, setFileSelected] = useState(null)

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Only image files are allowed!');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setData(prev => ({
                ...prev,
                imageUrl: reader.result
            }));
        };
        reader.readAsDataURL(file);

        setFileSelected(file);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!data.name) {
            toast.error("Category name is required")
            return
        }

        try {
            setLoading(true)
            
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('_id', data._id);
            
            if (fileSelected) {
                formData.append('image', fileSelected);
            }

            const response = await Axios({
                url: SummaryApi.updateCategory.url.replace(':id', data._id),
                method: SummaryApi.updateCategory.method,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            
            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                close()
                fetchData()
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='fixed inset-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4'>
            <div className='bg-white max-w-md w-full p-6 rounded-lg shadow-xl'>
                <div className='flex items-center justify-between mb-4'>
                    <h1 className='text-xl font-semibold'>Update Category</h1>
                    <button 
                        onClick={close} 
                        className='text-gray-500 hover:text-gray-700 transition-colors'
                        disabled={loading}
                    >
                        <IoClose size={25} />
                    </button>
                </div>
                
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <div className='space-y-2'>
                        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                            Name *
                        </label>
                        <input
                            type='text'
                            id='name'
                            placeholder='Enter category name'
                            value={data.name}
                            name='name'
                            onChange={handleOnChange}
                            className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                            Image
                        </label>
                        <div className='flex flex-col md:flex-row items-start gap-4'>
                            <div className='border-2 border-dashed border-gray-300 rounded-md w-full md:w-40 h-40 flex items-center justify-center'>
                                {data.imageUrl ? (
                                    <img
                                        alt='category preview'
                                        src={data.imageUrl}
                                        className='w-full h-full object-contain p-2'
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                            e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                                        }}
                                    />
                                ) : (
                                    <div className='text-center p-2'>
                                        <p className='text-sm text-gray-400'>No image selected</p>
                                        <img
                                            src='https://via.placeholder.com/150?text=No+Image'
                                            alt='placeholder'
                                            className='mt-2 mx-auto'
                                        />
                                    </div>
                                )}
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label 
                                    htmlFor='categoryImage'
                                    className={`px-4 py-2 border rounded-md text-sm font-medium text-center cursor-pointer
                                        ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                                         'border-blue-500 text-blue-600 hover:bg-blue-50'}
                                    `}
                                >
                                    {data.imageUrl ? 'Change Image' : 'Upload Image'}
                                    <input
                                        type='file'
                                        id='categoryImage'
                                        className='hidden'
                                        onChange={handleFileChange}
                                        accept='image/*'
                                        disabled={loading}
                                    />
                                </label>
                                <p className='text-xs text-gray-500 text-center'>
                                    Max file size: 5MB
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-end gap-3 pt-4'>
                        <button
                            type='button'
                            onClick={close}
                            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className={`px-4 py-2 rounded-md text-sm font-medium text-white
                                ${(!data.name || loading) ?
                                    'bg-blue-300 cursor-not-allowed' :
                                    'bg-blue-600 hover:bg-blue-700'}
                            `}
                            disabled={!data.name || loading}
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default EditCategory