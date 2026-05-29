import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const UploadCategoryModel = ({ close, fetchData }) => {
    const [categoryData, setCategoryData] = useState({
        name: "",
    });
    const [imagePreview, setImagePreview] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        setSelectedFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryData.name || !selectedFile) {
            toast.error('Please provide a category name and image');
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('name', categoryData.name);
            formData.append('image', selectedFile);

            const response = await Axios({
                url: SummaryApi.addCategory.url,
                method: SummaryApi.addCategory.method,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                close();
                fetchData();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='fixed inset-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4'>
            <div className='bg-white max-w-md w-full p-6 rounded-lg shadow-xl'>
                <div className='flex items-center justify-between mb-4'>
                    <h1 className='text-xl font-semibold'>Add Category</h1>
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
                            id='name'
                            name='name'
                            value={categoryData.name}
                            onChange={handleChange}
                            className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            placeholder='Enter category name'
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                            Image *
                        </label>
                        <div className='flex flex-col md:flex-row items-start gap-4'>
                            <div className='border-2 border-dashed border-gray-300 rounded-md w-full md:w-40 h-40 flex items-center justify-center'>
                                {imagePreview ? (
                                    <img
                                        alt='category preview'
                                        src={imagePreview}
                                        className='w-full h-full object-contain p-2'
                                    />
                                ) : (
                                    <p className='text-sm text-gray-400'>No image selected</p>
                                )}
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label 
                                    htmlFor='uploadCategoryImage'
                                    className={`px-4 py-2 border rounded-md text-sm font-medium text-center cursor-pointer
                                        ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                                         'border-blue-500 text-blue-600 hover:bg-blue-50'}
                                    `}
                                >
                                    {imagePreview ? 'Change Image' : 'Upload Image'}
                                    <input
                                        type='file'
                                        id='uploadCategoryImage'
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
                                ${(!categoryData.name || !selectedFile || loading) ?
                                    'bg-blue-300 cursor-not-allowed' :
                                    'bg-blue-600 hover:bg-blue-700'}
                            `}
                            disabled={!categoryData.name || !selectedFile || loading}
                        >
                            {loading ? 'Submitting...' : 'Add Category'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default UploadCategoryModel;