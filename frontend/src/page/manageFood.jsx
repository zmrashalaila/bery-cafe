import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import Sidebar from '../page/Sidebar';

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [foodData, setFoodData] = useState({
    id_menu: '',
    nama_menu: '',
    jenis: '',
    harga: '',
    deskripsi: '',
    gambar: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [imageFile, setImageFile] = useState(null); // State to hold the uploaded image file
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State for confirmation modal
  const [foodToDelete, setFoodToDelete] = useState(null); // State to hold the food item to delete


  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/menu', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFoods(data.data || []);
      } else {
        console.error('Failed to fetch foods');
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  };

  const openFormToAdd = () => {
    setIsEditing(false);
    setFoodData({ id_menu: '', nama_menu: '', jenis: '', harga: '', deskripsi: '', gambar: '' });
    setImageFile(null); // Reset the image file
    setShowForm(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // Set the selected file
      setFoodData({ ...foodData, gambar: file.name }); // Use the file name for display purposes
    }
  };

  const handleSaveFood = async () => {
    const formData = new FormData();
    formData.append('nama_menu', foodData.nama_menu);
    formData.append('jenis', foodData.jenis);
    formData.append('harga', foodData.harga);
    formData.append('deskripsi', foodData.deskripsi);
    if (imageFile) {
      formData.append('gambar', imageFile); // Append the file to the FormData
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(isEditing ? `http://localhost:8000/menu/${foodData.id_menu}` : 'http://localhost:8000/menu', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchFoods(); // Refresh the food list
        closeForm();
      } else {
        console.error('Failed to save food');
      }
    } catch (error) {
      console.error('Error saving food:', error);
    }
  };

  const openModal = (menu) => {
    setCurrentMenu(menu);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentMenu(null);
  };

  const openFormToEdit = (menu) => {
    setIsEditing(true);
    setFoodData(menu);
    setImageFile(null); // Reset the image file
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFoodData({ id_menu: '', nama_menu: '', jenis: '', harga: '', deskripsi: '', gambar: '' });
    setImageFile(null); // Reset the image file
  };

  const handleDeleteFood = async (food) => {
    try {
      const token = localStorage.getItem('token'); // Get the token for authorization
      const response = await fetch(`http://localhost:8000/menu/${food.id_menu}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Set authorization header
        },
      });

      if (response.ok) {
        console.log("Item deleted successfully"); // Log success message
        fetchFoods(); // Refresh the food list after successful deletion
      } else {
        console.error('Failed to delete food item'); // Log failure message
      }
    } catch (error) {
      console.error('Error deleting food:', error); // Log any errors
    }
  };

  const openConfirmModal = (food) => {
    setFoodToDelete(food); // Set the food item to delete
    setShowConfirmModal(true); // Show the confirmation modal
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setFoodToDelete(null); // Reset the food item
  };
  return (
    <>
      <Sidebar />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Manage Foods</h1>

        {/* Button Tambah */}
        <div className="flex justify-end mb-6">
          <button
            className="bg-pastelRed text-white py-2 px-4 rounded-full hover:bg-pastelDarkRed transition duration-300 shadow-md"
            onClick={openFormToAdd}
          >
            Add New Food
          </button>
        </div>

        {/* Tabel Makanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {foods.map((food) => (
            <div key={food.id_menu} className="bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition duration-300">
              <img src={'http://localhost:8000/menu-image/' + food.gambar} alt={food.nama_menu} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{food.nama_menu}</h2>
                <p className="text-lg font-bold text-gray-900 mt-2">Rp {food.harga.toLocaleString('id-ID')}</p>
                <p className="text-gray-700">Type: {food.jenis}</p>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => openModal(food)} // Assuming openModal shows details
                    className="bg-pastelDarkRed text-white py-1 px-4 rounded-full hover:bg-pastelRed transition duration-300"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => openFormToEdit(food)} // Assuming this edits the food
                    className="bg-pastelRose text-white py-1 px-4 rounded-full hover:bg-pastelPink transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openConfirmModal(food)} // Call the delete function
                    className="bg-red-600 text-white py-1 px-4 rounded-full hover:bg-red-700 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full transform transition duration-300 ease-in-out scale-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
              <p className="text-gray-700 mb-6">Are you sure you want to delete "{foodToDelete?.nama_menu}"?</p>
              <div className="flex justify-end">
                <button
                  onClick={handleDeleteFood} // Call delete function
                  className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition duration-300"
                >
                  I'm Sure
                </button>
                <button
                  onClick={closeConfirmModal} // Close the modal
                  className="ml-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition duration-300"
                >
                  Not Sure
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Detail Menu */}
        {showModal && currentMenu && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full transform transition duration-300 ease-in-out scale-100">
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 transition duration-300 text-right">
                &times;
              </button>
              <img src={'http://localhost:8000/menu-image/' + currentMenu.gambar} alt={currentMenu.nama_menu} className="w-full h-48 object-cover" />
              <div className="mt-4">
                <h3 className="text-2xl font-semibold">{currentMenu.nama_menu}</h3>
                <p className="text-gray-600">{currentMenu.deskripsi}</p>
                <p className="text-gray-700 font-semibold">type: {currentMenu.jenis}</p>
                <p className="font-bold text-lg text-gray-900 mt-2">Rp {currentMenu.harga.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Tambah/Edit Menu */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full transform transition duration-300 ease-in-out scale-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{isEditing ? 'Edit Food' : 'Add New Food'}</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleSaveFood(); }}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Food Name</label>
                  <input
                    type="text"
                    value={foodData.nama_menu}
                    onChange={(e) => setFoodData({ ...foodData, nama_menu: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter food name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Type</label>
                  <select
                    value={foodData.jenis}
                    onChange={(e) => setFoodData({ ...foodData, jenis: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="makanan">Makanan</option>
                    <option value="minuman">Minuman</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    value={foodData.harga}
                    onChange={(e) => setFoodData({ ...foodData, harga: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    value={foodData.deskripsi}
                    onChange={(e) => setFoodData({ ...foodData, deskripsi: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter description"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Upload Image</label>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-pastelRed text-white py-2 px-4 rounded-full hover:bg-pastelDarkRed transition duration-300"
                  >
                    {isEditing ? 'Update Food' : 'Add Food'}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="ml-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageFoods;
