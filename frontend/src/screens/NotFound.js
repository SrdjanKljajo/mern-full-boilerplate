import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className='page_404'>
      <div className='container text-dark'>
        <div className='row'>
          <div className='col-sm-12 '>
            <div className='col-sm-10 col-sm-offset-1  text-center'>
              <div className='four_zero_four_bg'>
                <h1 className='text-center '>404</h1>
              </div>

              <div className='contant_box_404'>
                <h3 className='h2'>Uneli ste pogrešnu web adresu</h3>
                <Link to='/blogs' className='link_404'>
                  Nazad
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFound
