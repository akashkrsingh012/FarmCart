import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditCategory from '../components/EditCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";

const CategoryPage = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false)
    const [loading, setLoading] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({
        name: "",
        image: "",
        imageUrl: "",
        _id: ""
    })
    const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategory, setDeleteCategory] = useState({
        _id: ""
    })
    const [imageURL, setImageURL] = useState("")
    const columnHelper = createColumnHelper()
    
    const fetchCategory = async() => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })
            const { data: responseData } = response

            if(responseData.success){
                const transformedData = responseData.data.map(category => {
                    let imageUrl = category.image;
                    
                    if (category.image && !category.image.startsWith('http')) {
                        const normalizedPath = category.image.replace(/\\/g, '/')
                        const cleanPath = normalizedPath.startsWith('/') 
                            ? normalizedPath.substring(1) 
                            : normalizedPath;
                        imageUrl = `http://localhost:8080/${cleanPath}`
                    }
                    
                    return {
                        ...category,
                        imageUrl: imageUrl
                    }
                })
                setCategoryData(transformedData)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    const handleDeleteCategory = async() => {
        try {
            const response = await Axios({
                url: SummaryApi.deleteCategory.url.replace(':id', deleteCategory._id),
                method: SummaryApi.deleteCategory.method
            })

            const { data: responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const columns = [
        columnHelper.accessor('name', {
            header: "Name",
            cell: ({row}) => (
                <span className='font-medium'>{row.original.name}</span>
            )
        }),
        columnHelper.accessor('image', {
            header: "Image",
            cell: ({row}) => (
                <div className='flex justify-center items-center'>
                    <img 
                        src={row.original.imageUrl}
                        alt={row.original.name}
                        className='w-12 h-12 cursor-pointer object-contain rounded bg-gray-50'
                        onClick={() => setImageURL(row.original.imageUrl)}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image'
                        }}
                    />
                </div>
            )
        }),
        columnHelper.accessor('_id', {
            header: "Actions",
            cell: ({row}) => (
                <div className='flex items-center justify-center gap-3'>
                    <button 
                        onClick={() => {
                            setOpenEdit(true)
                            setEditData(row.original)
                        }} 
                        className='p-2 bg-green-100 rounded-full hover:text-green-600'
                    >
                        <HiPencil size={20}/>
                    </button>
                    <button 
                        onClick={() => {
                            setOpenConfirmBoxDelete(true)
                            setDeleteCategory({ _id: row.original._id })
                        }} 
                        className='p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600'
                    >
                        <MdDelete size={20}/>
                    </button>
                </div>
            )
        })
    ]

    return (
        <section className='p-4'>
            <div className='p-4 bg-white shadow-md rounded-lg flex items-center justify-between mb-4'>
                <h2 className='font-semibold text-lg'>Categories</h2>
                <button 
                    onClick={() => setOpenUploadCategory(true)} 
                    className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                >
                    Add Category
                </button>
            </div>
            
            {loading && <Loading />}
            
            {!loading && categoryData.length === 0 && <NoData text="No categories found" />}

            {!loading && categoryData.length > 0 && (
                <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                    <DisplayTable
                        data={categoryData}
                        column={columns}
                    />
                </div>
            )}

            {openUploadCategory && (
                <UploadCategoryModel 
                    fetchData={fetchCategory} 
                    close={() => setOpenUploadCategory(false)}
                />
            )}

            {openEdit && (
                <EditCategory 
                    data={editData} 
                    close={() => setOpenEdit(false)} 
                    fetchData={fetchCategory}
                />
            )}

            {openConfirmBoxDelete && (
                <CofirmBox 
                    title="Delete Category"
                    message="Are you sure you want to delete this category? This will remove the category and any dependencies."
                    close={() => setOpenConfirmBoxDelete(false)} 
                    cancel={() => setOpenConfirmBoxDelete(false)} 
                    confirm={handleDeleteCategory}
                />
            )}

            {imageURL && (
                <ViewImage 
                    url={imageURL} 
                    close={() => setImageURL("")}
                />
            )}
        </section>
    )
}

export default CategoryPage