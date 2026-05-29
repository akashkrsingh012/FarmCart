import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import EditSubCategory from '../components/EditSubCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageURL, setImageURL] = useState("")
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({
    _id: ""
  })
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: ""
  })
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)

  const fetchSubCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getSubCategory
      })
      const { data: responseData } = response

      if (responseData.success) {
        // Data is already transformed in the backend with imageUrl
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubCategory()
  }, [])

  const column = [
    columnHelper.accessor('name', {
      header: "Name"
    }),
    columnHelper.accessor('image', {
      header: "Image",
      cell: ({ row }) => {
        return <div className='flex justify-center items-center'>
          <img
            src={row.original.imageUrl || row.original.image}
            alt={row.original.name}
            className='w-8 h-8 cursor-pointer object-contain'
            onClick={() => {
              setImageURL(row.original.imageUrl || row.original.image)
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150?text=No+Image'
            }}
          />
        </div>
      }
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap gap-1">
            {
              row.original.category.map((c, index) => {
                return (
                  <p key={c._id + "table"} className='shadow-md px-1 inline-block text-xs'>{c.name}</p>
                )
              })
            }
          </div>
        )
      }
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className='flex items-center justify-center gap-3'>
            <button onClick={() => {
              setOpenEdit(true)
              setEditData(row.original)
            }} className='p-2 bg-green-100 rounded-full hover:text-green-600'>
              <HiPencil size={20} />
            </button>
            <button onClick={() => {
              setOpenDeleteConfirmBox(true)
              setDeleteSubCategory(row.original)
            }} className='p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600'>
              <MdDelete size={20} />
            </button>
          </div>
        )
      }
    })
  ]

  const handleDeleteSubCategory = async () => {
    try {
      const id = deleteSubCategory._id;
      const response = await Axios({
        url: SummaryApi.deleteSubCategory.url.replace(':id', id),
        method: SummaryApi.deleteSubCategory.method
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setOpenDeleteConfirmBox(false);
        setDeleteSubCategory({ _id: "" });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }

  return (
    <section className=''>
      <div className='p-2 bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'>Sub Category</h2>
        <button onClick={() => setOpenAddSubCategory(true)} className='text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded'>Add Sub Category</button>
      </div>

      <div className='overflow-auto w-full max-w-[95vw]'>
        <DisplayTable
          data={data}
          column={column}
          loading={loading}
        />
      </div>

      {openAddSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenAddSubCategory(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {ImageURL && (
        <ViewImage
          url={ImageURL}
          close={() => setImageURL("")}
        />
      )}

      {openEdit && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {openDeleteConfirmBox && (
        <CofirmBox
          title="Delete Sub Category"
          message="Are you sure you want to delete this sub category?"
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </section>
  )
}

export default SubCategoryPage