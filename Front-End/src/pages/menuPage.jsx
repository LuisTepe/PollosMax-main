import { useState, useEffect } from 'react';
import axios from 'axios';
import './menuPage.css';
import Sidebar from '../../components/ResponsiveAppBar';
import PopupProduct from '../../components/PopUpProduct';
import PopUpCompra from '../../components/PopUpCompra';
import { getLoggedInUser } from './LoginPage';

export default function MenuPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [productAmounts, setProductAmounts] = useState([]);
  const [tableProducts, setTableProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPopupCompra, setShowPopupCompra] = useState(false);
  const user = getLoggedInUser();

  const [color, setColor] = useState({
    color: ' rgb(49, 48, 77)',
    borderColor: ' rgb(49, 48, 77)',
    borderTopColor: ' rgb(49, 48, 77)',
    borderRightColor: ' rgb(49, 48, 77)',
    borderBottomColor: ' rgb(49, 48, 77)',
  })

  const [search, setSearch] = useState('');
  const [showPopupProduct, setShowPopupProduct] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    async function fetchProducts() {
      // ...
      setProducts(products);
      setSearchResults(products); // Inicializa searchResults con todos los productos
    }

    fetchProducts();
  }, []);

  function handleOpenPopupProduct(product) {
    setSelectedProduct(product);

    const productAmount = Number(product.productAmount);
    if (Number.isFinite(productAmount)) {
      setProductAmounts([productAmount]); // Establece productAmounts como un array que contiene productAmount
    } else {
      console.error('Error: productAmount is not a number:', product.productAmount);
    }

    setShowPopupProduct(true);
  }

  const handleClosePopupProduct = () => {
    setSelectedProduct(null);
    setShowPopupProduct(false);
  };

  const filteredProducts = searchResults.filter(product => {
    // Comprueba si product y productName existen antes de llamar a toLowerCase()
    const nameMatch = product && product.productName && product.productName.toLowerCase().includes(search.toLowerCase());

    // Comprueba si product y productAmount existen, luego convierte productAmount a una cadena y comprueba si coincide con la búsqueda
    const amountMatch = product && product.productAmount && product.productAmount.toString().includes(search);

    // Devuelve true si cualquiera de las condiciones es verdadera
    return nameMatch || amountMatch;
  });

  const searchProducts = async (searchValue) => {
    // Llama a tu API cuando el valor de búsqueda cambia
    try {
      const response = await axios.post('http://localhost:3000/search', { search: searchValue });
      const products = response.data.map(item => ({
        productName: item.productName,
        productAmount: item.productAmount
      }));
      console.log('Products:', products);
      setSearchResults(products); // Actualiza searchResults con los productos encontrados
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearchChange = async (event) => {
    const searchValue = event.target.value; // Extrae el valor del campo de entrada del objeto de evento

    // Si la cadena no está vacía, verifica si es alfanumérica
    console.log('Search value:', searchValue);
    if (searchValue && !/^[a-z0-9 ]+$/i.test(searchValue)) {
      console.error('Only alphanumeric characters are allowed');
      return;
    }

    setSearch(searchValue);
    searchProducts(searchValue);
  };

  useEffect(() => {
    searchProducts(''); // Llama a searchProducts con una cadena vacía
  }, []); // El array vacío significa que este efecto se ejecutará solo una vez, cuando se monte el componente

  function handleMouseUp() {
    setColor({
      color: ' rgb(49, 48, 77)',
      borderColor: ' rgb(49, 48, 77)',
      borderTopColor: ' rgb(49, 48, 77)',
      borderRightColor: ' rgb(49, 48, 77)',
      borderBottomColor: ' rgb(49, 48, 77)',
    })
  }

  function handleMouseDown() {
    setColor({
      color: ' rgb(49, 48, 77)',
      borderColor: ' rgb(49, 48, 77)',
      borderTopColor: ' rgb(49, 48, 77)',
      borderRightColor: ' rgb(49, 48, 77)',
      borderBottomColor: ' rgb(49, 48, 77)',
    })
  }

  function handleHover() {
    setColor({
      color: ' rgb(49, 48, 77)',
      borderColor: ' rgb(49, 48, 77)',
      borderTopColor: ' rgb(49, 48, 77)',
      borderRightColor: ' rgb(49, 48, 77)',
      borderBottomColor: ' rgb(49, 48, 77)',
    })
  }

  async function handleConfirm(quantity) {
    console.log('Confirming quantity:', quantity);
    console.log('Selected product:', selectedProduct);

    try {
      // Llama al backend para buscar el producto en la base de datos
      const response = await axios.post('http://localhost:3000/searchProductos', { id: selectedProduct.productName });
      const product = response.data;

      console.log('Fetched product:', product);

      // Crea un nuevo producto con productName y price del producto buscado y quantity del popup
      const newProduct = {
        productName: selectedProduct.productName,
        price: product.productPrice,
        quantity: quantity
      };
      console.log('New product:', newProduct);

      setTableProducts(prevTableProducts => [...prevTableProducts, newProduct]);
      handleClosePopupProduct();
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }

  function handleClearTable() {
    setTableProducts([]); // Limpia los productos de la tabla
  }

  function handleOpenPopupCompra() {
    setShowPopupCompra(true); // Abre el popup de compra
  }

  function handleClosePopupCompra() {
    setShowPopupCompra(false); // Cierra el popup de compra
  }

  async function handleCompra() {
    setShowPopupCompra(false); // Cierra el popup de compra

    var usuario;
    console.log(user);
    if (user === 'admin') {
      usuario = 1;
    } else {
      usuario = 2;
    }

    // Itera sobre los productos en la tabla
    for (const tableProduct of tableProducts) {
      // Verifica si quantity es un número
      if (!Number.isFinite(tableProduct.quantity)) {
        console.error('Error: quantity is not a number for', tableProduct.productName);
        continue;
      }

      try {
        // Busca el producto en la base de datos para obtener productAmount
        const response = await axios.post('http://localhost:3000/search', { search: tableProduct.productName });
        const product = response.data[0];

        // Verifica si productAmount es un número
        const productAmount = Number(product.productAmount);
        if (!Number.isFinite(productAmount)) {
          console.error('Error: productAmount is not a number for', tableProduct.productName);
          continue;
        }

        // Calcula el nuevo productAmount
        const newProductAmount = product.productAmount - tableProduct.quantity;

        // Verifica si newProductAmount es un número no negativo
        if (!Number.isFinite(newProductAmount) || newProductAmount < 0) {
          console.error('Error: newProductAmount is not a valid number for', tableProduct.productName);
          continue;
        }

        // Actualiza la base de datos
        await axios.put('http://localhost:3000/updateProductAmount', {
          idProduct: product.idProduct,
          productAmount: newProductAmount
        });
        console.log('Product amount updated successfully for', tableProduct.productName);

        console.log('Product:', product);
        // Inserta un registro en la base de datos
        await axios.post('http://localhost:3000/insertProductChange', {
          idUser: usuario,
          idProduct: product.idProduct,
          idChangeType: 2, // idChangeType 2 es para Update
        });
        console.log('Product change inserted successfully for', tableProduct.productName);


      } catch (error) {
        console.error('Error updating product amount for', tableProduct.productName, ':', error);
      }
    }

    // Limpia los productos de la tabla después de la compra
    await handleSearchChange({ target: { value: '' } });
    handleClearTable();
  }
  // Calcular el total
  const total = tableProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const roundedTotal = Math.ceil(total);

  const productAmount = productAmounts[0];

  return (
    <div className='d-flex' style={{ background: 'rgb(245, 245, 245)', position: 'initial', flexWrap: 'wrap' }}>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div style={{ padding: isSidebarOpen ? '0px 240px 150px 240px' : '0px 0px 150px 40px', position: 'initial' }}>
        <div className="wrapper" style={{ background: 'rgb(245, 245, 245)', fontFamily: 'Allerta, sans-serif', fontSize: 22, borderTopStyle: 'none' }}>
          <div id="content" style={{ background: 'rgb(245, 245, 245)', borderTopWidth: 0, borderBottomWidth: 2, borderBottomColor: '#7c3271' }}>
            <div style={{ marginTop: 10, marginLeft: 30 }}>
              <h1 style={{ fontSize: 25, fontFamily: 'Allerta, sans-serif' }}>Expendio Bachoco</h1>
              <h1 style={{ fontFamily: 'Allerta, sans-serif', fontSize: 38 }}>EL POLLO MAX</h1>
            </div>
            <div className="d-flex justify-content-between" style={{ marginTop: 50, marginLeft: 50 }}>
              <div className='d-flex' style={{ background: 'rgb(245, 245, 245)', position: 'initial', flexWrap: 'wrap', overflow: 'hidden' }}>
                <table className="table table-borderless">
                  <thead style={{ background: 'rgb(245, 245, 245)' }}>
                    <tr style={{ background: 'rgb(245, 245, 245)' }}>
                      <th style={{ background: 'rgb(245, 245, 245)', fontSize: 25, paddingRight: 50, borderTopWidth: 0, borderBottomWidth: 2, borderBottomColor: 'black', fontFamily: 'Allerta, sans-serif', color: 'black' }}>Producto</th>
                      <th style={{ background: 'rgb(245, 245, 245)', fontSize: 25, marginRight: 0, paddingRight: 50, borderTopWidth: 0, borderBottomWidth: 2, borderBottomColor: 'black', fontFamily: 'Allerta, sans-serif', color: 'black' }}>Cantidad</th>
                      <th style={{ background: 'rgb(245, 245, 245)', fontSize: 25, width: 100, paddingRight: 50, borderTopWidth: 0, borderBottomWidth: 2, borderBottomColor: 'black', fontFamily: 'Allerta, sans-serif', color: 'black' }}>P.U.</th>
                      <th style={{ background: 'rgb(245, 245, 245)', fontSize: 25, marginRight: 0, paddingRight: 50, borderTopWidth: 0, borderBottomWidth: 2, borderBottomColor: 'black', fontFamily: 'Allerta, sans-serif', color: 'black' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableProducts.map((product, index) => (
                      <tr key={index}>
                        <td style={{ background: 'rgb(245, 245, 245)', borderBottomWidth: 0, fontFamily: 'Allerta, sans-serif', fontSize: 24, border: 'none' }}>{product.productName}</td>
                        <td style={{ background: 'rgb(245, 245, 245)', borderBottomWidth: 0, fontFamily: 'Allerta, sans-serif', fontSize: 24, border: 'none' }}>{product.quantity}</td>
                        <td style={{ background: 'rgb(245, 245, 245)', width: 100, borderBottomWidth: 0, fontFamily: 'Allerta, sans-serif', fontSize: 24, border: 'none' }}>{product.price}</td>
                        <td style={{ background: 'rgb(245, 245, 245)', borderBottomWidth: 0, fontFamily: 'Allerta, sans-serif', fontSize: 24, border: 'none' }}>{product.quantity * product.price}</td>
                      </tr>
                    ))}
                    <tr>
                      <td style={{ background: 'rgb(245, 245, 245)', borderTopColor: 'black', borderTopWidth: "2px", borderLeft: '0px', borderRight: '0px', borderBottom: '0px', borderRadius: '0px' }}></td>
                      <td style={{ background: 'rgb(245, 245, 245)', borderTopColor: 'black', borderTopWidth: "2px", borderLeft: '0px', borderRight: '0px', borderBottom: '0px', borderRadius: '0px' }}></td>
                      <td style={{ background: 'rgb(245, 245, 245)', fontFamily: 'Allerta, sans-serif', borderTopWidth: "2px", fontSize: 25, borderTopColor: 'black', borderLeft: '0px', borderRight: '0px', borderBottom: '0px', borderRadius: '0px' }}>Total</td>
                      <td style={{ background: 'rgb(245, 245, 245)', fontFamily: 'Allerta, sans-serif', borderTopWidth: "2px", fontSize: 25, borderTopColor: 'black', borderLeft: '0px', borderRight: '0px', borderBottom: '0px', borderRadius: '0px' }}>${total.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{ background: 'rgb(245, 245, 245)', border: 'none' }}></td>
                      <td style={{ background: 'rgb(245, 245, 245)', border: 'none' }}></td>
                      <td style={{ background: 'rgb(245, 245, 245)', fontFamily: 'Allerta, sans-serif', fontSize: 25, border: 'none' }}>Redondeo</td>
                      <td style={{ background: 'rgb(245, 245, 245)', fontFamily: 'Allerta, sans-serif', fontSize: 25, border: 'none' }}>${roundedTotal}</td>
                    </tr>
                  </tbody>
                </table>

                <button style={{ width: 200, height: 60, fontFamily: 'Allerta, sans-serif', fontSize: 18, border: 'none', background: color.color, outline: 'none', marginLeft: 70, marginRight: 70 }} onClick={handleClearTable}>Limpiar Carrito</button>
                <button style={{ width: 200, height: 60, fontFamily: 'Allerta, sans-serif', fontSize: 24, border: 'none', background: color.color, outline: 'none' }} onClick={handleOpenPopupCompra}>Cobrar</button>
              </div>

              <div style={{ marginLeft: 50 }}>
                <label className="form-label" style={{ fontFamily: 'Allerta, sans-serif', fontSize: 25, color: 'var(--bs-emphasis-color)', marginLeft: 20 }}>Buscar:&nbsp;</label>
                <input
                  type="search"
                  style={{ background: 'rgb(245, 245, 245)', width: 160, outline: 'none', color: 'black', padding: '0px 10px' }}
                  value={search}
                  onChange={handleSearchChange}
                />
                <div>
                  <ul className="list-group">
                    {filteredProducts.map((product, index) => (
                      <li key={index} className="list-group-item d-xl-flex justify-content-xl-center" style={{ background: 'rgb(245, 245, 245)', border: 'none', color: 'rgb(255,255,255)' }}>
                        <button
                          onClick={() => handleOpenPopupProduct(product)}
                          className="btn btn-primary"
                          type="button"
                          style={{ width: 270, height: 60, fontFamily: 'Allerta, sans-serif', fontSize: 24, border: 'none', background: color.color, outline: 'none' }}
                          onMouseUp={handleMouseUp}
                          onMouseDown={handleMouseDown}
                          onMouseOver={handleHover}
                          onMouseLeave={handleMouseUp}
                        >
                          {product.productName}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                {showPopupProduct && (
                  <PopupProduct
                    onClose={handleClosePopupProduct}
                    onConfirm={handleConfirm}
                    productName={selectedProduct.productName}
                    productAmount={productAmount}
                  />
                )}
                {showPopupCompra && (
                  <PopUpCompra
                    onClose={handleClosePopupCompra}
                    total={total}
                    onCompra={handleCompra}
                  />

                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
