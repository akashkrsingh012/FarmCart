import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const EditSubCategory = ({ close, data, fetchData }) => {
    const [subCategoryData, setSubCategoryData] = useState({
        _id: data._id,
        name: data.name,
        image: data.image,
        category: data.category || []
    });
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(data.imageUrl || data.image || '');
    const allCategory = useSelector(state => state.product.allCategory);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSubCategoryData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        });
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

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        setImageFile(file);
    };

    const handleRemoveCategorySelected = (categoryId) => {
        setSubCategoryData((prev) => {
            return {
                ...prev,
                category: prev.category.filter(cat => cat._id !== categoryId)
            }
        });
    };

    const handleAddCategory = (e) => {
        const value = e.target.value;
        if (!value) return;

        const categoryDetails = allCategory.find(el => el._id === value);
        if (!categoryDetails) return;

        // Check if category is already selected
        if (!subCategoryData.category.some(cat => cat._id === categoryDetails._id)) {
            setSubCategoryData((prev) => {
                return {
                    ...prev,
                    category: [...prev.category, categoryDetails]
                }
            });
        }
        
        // Reset select value
        e.target.value = "";
    };

    const handleSubmitSubCategory = async (e) => {
        e.preventDefault();
        
        if (!subCategoryData.name || subCategoryData.category.length === 0) {
            toast.error('Name and at least one category are required');
            return;
        }

        try {
            setLoading(true);
            
            // Create FormData to handle file uploads
            const formData = new FormData();
            formData.append('name', subCategoryData.name);
            
            // Add category IDs
            formData.append('category', JSON.stringify(
                subCategoryData.category.map(cat => cat._id)
            ));
            
            // Only add image file if it has been changed
            if (imageFile) {
                formData.append('image', imageFile);
            } else if (subCategoryData.image) {
                formData.append('image', subCategoryData.image);
            }

            // Use route parameter for the ID
            const id = subCategoryData._id;
            const response = await Axios({
                url: SummaryApi.updateSubCategory.url.replace(':id', id),
                method: SummaryApi.updateSubCategory.method,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                close?.();
                fetchData?.();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='fixed inset-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-2xl bg-white p-6 rounded-lg shadow-xl'>
                <div className='flex items-center justify-between mb-4'>
                    <h1 className='text-xl font-semibold'>Edit Sub Category</h1>
                    <button 
                        onClick={close} 
                        className='text-gray-500 hover:text-gray-700 transition-colors'
                        disabled={loading}
                    >
                        <IoClose size={25} />
                    </button>
                </div>

                <form className='space-y-4' onSubmit={handleSubmitSubCategory}>
                    <div className='space-y-2'>
                        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                            Name *
                        </label>
                        <input
                            id='name'
                            name='name'
                            value={subCategoryData.name}
                            onChange={handleChange}
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
                            <div className='border-2 border-dashed border-gray-300 rounded-md w-full md:w-40 h-40 flex items-center justify-center overflow-hidden'>
                                {imagePreview ? (
                                    <img
                                        alt='subcategory preview'
                                        src={imagePreview}
                                        className='w-full h-full object-contain p-2'
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                        }}
                                    />
                                ) : (
                                    <p className='text-sm text-gray-400'>No image selected</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label 
                                    htmlFor='editSubCategoryImage'
                                    className={`px-4 py-2 border rounded-md text-sm font-medium cursor-pointer
                                        ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                                        'border-blue-500 text-blue-600 hover:bg-blue-50'}
                                    `}
                                >
                                    {imagePreview ? 'Change Image' : 'Upload Image'}
                                    <input
                                        type='file'
                                        id='editSubCategoryImage'
                                        className='hidden'
                                        onChange={handleFileChange}
                                        accept='image/*'
                                        disabled={loading}
                                    />
                                </label>
                                {imagePreview && (
                                    <p className="text-xs text-gray-500">
                                        The image will be updated when you save changes
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                            Categories *
                        </label>
                        <div className='border border-gray-300 rounded-md p-2'>
                            <div className='flex flex-wrap gap-2 mb-2'>
                                {subCategoryData.category.map((cat) => (
                                    <div 
                                        key={cat._id} 
                                        className='bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1'
                                    >
                                        <span className='text-sm'>{cat.name}</span>
                                        <button
                                            type='button'
                                            onClick={() => handleRemoveCategorySelected(cat._id)}
                                            className='text-gray-500 hover:text-red-500'
                                            disabled={loading}
                                        >
                                            <IoClose size={16} />
                                        </button>
                                    </div>
                                ))}
                                {subCategoryData.category.length === 0 && (
                                    <p className="text-sm text-gray-400">No categories selected</p>
                                )}
                            </div>

                            <select
                                className='w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                onChange={handleAddCategory}
                                disabled={loading || allCategory.length === 0}
                                value=""
                            >
                                <option value="">{allCategory.length ? 'Select Category' : 'No categories available'}</option>
                                {allCategory.map((category) => (
                                    <option 
                                        value={category._id} 
                                        key={category._id}
                                        disabled={subCategoryData.category.some(cat => cat._id === category._id)}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
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
                                ${(!subCategoryData.name || subCategoryData.category.length === 0 || loading) ?
                                    'bg-blue-300 cursor-not-allowed' :
                                    'bg-blue-600 hover:bg-blue-700'}
                            `}
                            disabled={!subCategoryData.name || subCategoryData.category.length === 0 || loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default EditSubCategory;