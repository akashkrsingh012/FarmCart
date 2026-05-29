import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
    image: "", // Image URL as a string
    category: [],
    subCategory: [],
    unit: "",
    stock: 0,
    price: 0,
    discount: 0,
    more_details: {},
  });

  const [viewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteImage = () => {
    setData((prev) => ({
      ...prev,
      image: "", // Clear the image field
    }));
  };

  const handleRemoveCategory = (index) => {
    data.category.splice(index, 1);
    setData({ ...data });
  };

  const handleRemoveSubCategory = (index) => {
    data.subCategory.splice(index, 1);
    setData({ ...data });
  };

  const handleAddField = () => {
    setData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: "",
      },
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Reset error message

    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        successAlert(responseData.message);
        setData({
          name: "",
          image: "", // Reset to an empty string
          category: [],
          subCategory: [],
          unit: "",
          stock: 0,
          price: 0,
          discount: 0,
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error);
      setErrorMessage("Failed to submit the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className=''>
      <div className='p-2 bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'>Upload Product</h2>
      </div>
      <div className='grid p-3'>
        <form className='grid gap-4' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor='name' className='font-medium'>Name</label>
            <input 
              id='name'
              type='text'
              placeholder='Enter product name'
              name='name'
              value={data.name}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>
          <div className='grid gap-1'>
            <label htmlFor='description' className='font-medium'>Description</label>
            <textarea 
              id='description'
              placeholder='Enter product description'
              name='description'
              value ={data.description}
              onChange={handleChange}
              required
              rows={3}
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
            />
          </div>
          <div>
            <p className='font-medium'>Image URL</p>
            <input 
              type='text'
              placeholder='Enter image URL'
              name='image'
              value={data.image}
              onChange={handleChange}
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
            {data.image && (
              <div className='h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative'>
                <img
                  src={data.image}
                  alt="Uploaded"
                  className='w-full h-full object-scale-down cursor-pointer'
                  onClick={() => setViewImageURL(data.image)}
                />
                <div onClick={handleDeleteImage} className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white cursor-pointer'>
                  <MdDelete />
                </div>
              </div>
            )}
          </div>
          <div className='grid gap-1'>
            <label className='font-medium'>Category</label>
            <div>
              <select
                className='bg-blue-50 border w-full p-2 rounded'
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const category = allCategory.find(el => el._id === value);
                  setData((prev) => ({
                    ...prev,
                    category: [...prev.category, category],
                  }));
                  setSelectCategory("");
                }}
              >
                <option value={""}>Select Category</option>
                {
                  allCategory.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))
                }
              </select>
              <div className='flex flex-wrap gap-3'>
                {
                  data.category.map((c, index) => (
                    <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                      <p>{c.name}</p>
                      <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveCategory(index)}>
                        <IoClose size={20} />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className='grid gap-1'>
            <label className='font-medium'>Sub Category</label>
            <div>
              <select
                className='bg-blue-50 border w-full p-2 rounded'
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const subCategory = allSubCategory.find(el => el._id === value);
                  setData((prev) => ({
                    ...prev,
                    subCategory: [...prev.subCategory, subCategory],
                  }));
                  setSelectSubCategory("");
                }}
              >
                <option value={""} className='text-neutral-600'>Select Sub Category</option>
                {
                  allSubCategory.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))
                }
              </select>
              <div className='flex flex-wrap gap-3'>
                {
                  data.subCategory.map((c, index) => (
                    <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                      <p>{c.name}</p>
                      <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveSubCategory(index)}>
                        <IoClose size={20} />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          <div className='grid gap-1'>
            <label htmlFor='unit' className='font-medium'>Unit</label>
            <input 
              id='unit'
              type='text'
              placeholder='Enter product unit'
              name='unit'
              value={data.unit}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>

          <div className='grid gap-1'>
            <label htmlFor='stock' className='font-medium'>Number of Stock</label>
            <input 
 id='stock'
              type='number'
              placeholder='Enter product stock'
              name='stock'
              value={data.stock}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>

          <div className='grid gap-1'>
            <label htmlFor='price' className='font-medium'>Price</label>
            <input 
              id='price'
              type='number'
              placeholder='Enter product price'
              name='price'
              value={data.price}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>

          <div className='grid gap-1'>
            <label htmlFor='discount' className='font-medium'>Discount</label>
            <input 
              id='discount'
              type='number'
              placeholder='Enter product discount'
              name='discount'
              value={data.discount}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>

          {/** Add more fields **/}
          {
            Object.keys(data.more_details).map((k) => (
              <div className='grid gap-1' key={k}>
                <label htmlFor={k} className='font-medium'>{k}</label>
                <input 
                  id={k}
                  type='text'
                  value={data.more_details[k]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setData((prev) => ({
                      ...prev,
                      more_details: {
                        ...prev.more_details,
                        [k]: value
                      }
                    }));
                  }}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>
            ))
          }

          <div onClick={() => setOpenAddField(true)} className='hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'>
            Add Fields
          </div>

          <button
            type="submit"
            className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'
            disabled={loading} // Disable button while loading
          >
            {loading ? <Loading /> : "Submit"}
          </button>

          {errorMessage && <p className='text-red-500'>{errorMessage}</p>} {/* Display error message */}
        </form>
      </div>

      {viewImageURL && (
        <ViewImage url={viewImageURL} close={() => setViewImageURL("")} />
      )}

      {openAddField && (
        <AddFieldComponent 
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)} 
        />
      )}
    </section>
  );
}

export default UploadProduct;