import { MdOutlineDelete } from 'react-icons/md';

interface MemberData {
	name: string;
	email: string;
}

interface MembersTableProps {
	data: MemberData[];
  onClick?: () => void;
}

const MembersTable = ({onClick, data} : MembersTableProps) => {
  return (
    <div>
      {data.map((member, index) => {
        const isFirst = index === 0;
        const isLast = index === data.length - 1;
        //Add appropriate borders and rounded edges depending on element index
        let conditionalClassNames = isFirst
          ? 'rounded-t border-t'
          : isLast
          ? 'rounded-b border-t border-b'
          : 'border-t';
        if (isFirst && isLast) {
          conditionalClassNames = 'rounded border-t border-b';
        }
        return (
          <div
            key={index}
            className={`flex flex-row justify-between items-center p-4 bg-crumpet-light-100 
											border-l border-r ${conditionalClassNames}
											border-crumpet-light-300 `}>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-oxford">{member.name}</p>
              <p className="text-sm text-grey-700">{member.email}</p>
            </div>
            <MdOutlineDelete
              className="text-lg text-grey-700 hover:text-grey-900 hover:cursor-pointer"
              onClick={onClick}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MembersTable;
