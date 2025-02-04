import React from 'react';

export const Receipt = ({ transactionReceipt, menuItems }) => {
    const calculateTotal = () => {
        return transactionReceipt.detail_transaksi.reduce((total, item) => {
            const menu = menuItems.find(menuItem => menuItem.id_menu === item.id_menu);
            return total + (menu ? menu.harga * item.quantity : 0);
        }, 0);
    };

    return (
        <div>
            {/* Template Nota */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-pastelRose">Belle Fiori</h2>
                <p className="text-gray-500 text-lg">{new Date().toLocaleDateString()}</p>
            </div>
            <h3 className="text-xl font-semibold my-4">Order List:</h3>
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-300">Menu</th>
                        <th className="py-2 px-4 border-b border-gray-300">Quantity</th>
                        <th className="py-2 px-4 border-b border-gray-300">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {transactionReceipt.detail_transaksi.map((item, index) => {
                        const menuItem = menuItems.find(menu => menu.id_menu === item.id_menu);
                        const totalHarga = menuItem?.harga * item.quantity;
                        return (
                            <tr key={index} className="border-b border-gray-300">
                                <td className="py-2 px-4">{menuItem?.nama_menu}</td>
                                <td className="py-2 px-4">{item.quantity}</td>
                                <td className="py-2 px-4">Rp {totalHarga.toLocaleString()}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="flex justify-between mb-2">
                <p className="font-semibold">Total:</p>
                <p className="font-bold">Rp {calculateTotal().toLocaleString()}</p>
            </div>
        </div>
    );
};
