let files: any[] | undefined = [
  {
    fieldname: 'images',
    originalname: 'item.jpg',
    filename: 'item.jpg',
    path: '/tmp/item.jpg',
  },
];

export function __setFiles(newFiles: any[] | undefined) {
  files = newFiles;
}

const multerMock = {
  array: () => (req: any, _res: any, next: () => void) => {
    req.files = files;
    next();
  },
};

export default multerMock;
