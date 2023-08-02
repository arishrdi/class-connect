import React, {useState} from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import Link from 'next/link'
import PopoverMenu from './ui/PopoverMenu'
import ModalEditClass from './modal/ModalEditClass'
import ModalDeleteClass from './modal/ModalDeleteClass'
import { type Class } from '@prisma/client'

type CardClassProps = {
  data: Class
}

const CardClass: React.FC<CardClassProps> = ({data}) => {
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  return (
    <Card
    className="group transition-all hover:shadow-lg"
    key={data.id}
  >
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <Link href={`/c/${data.id}`} className='line-clamp-2'>{data.name}</Link>
        <div className="-mr-4">
          <PopoverMenu
            label1='Edit'
            label2='Delete'
            onAction1={() => setOpenModalEdit(true)}
            onAction2={() => setOpenModalDelete(true)}
          />
          <ModalEditClass
            data={data}
            open={openModalEdit}
            onOpenChange={setOpenModalEdit}
          />
          <ModalDeleteClass
            data={data}
            open={openModalDelete}
            onOpenChange={setOpenModalDelete}
          />
        </div>
      </CardTitle>
      <CardDescription className='border-b-2'>
        <Link href={`/c/${data.id}`} className='line-clamp-2'>{data.section}</Link>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <h1>Code: {data.code}</h1>
    </CardContent>
  </Card>
  )
}

export default CardClass