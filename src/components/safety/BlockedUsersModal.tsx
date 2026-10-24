import React from "react"
import { Modal } from "../common/Modal"
import { Shield, UserX, Check } from "lucide-react"
import { StudentProfile } from "../../types"

interface BlockedUsersModalProps {
  isOpen: boolean
  onClose: () => void
  blockedUserIds: string[]
  allStudents: StudentProfile[]
  onUnblockUser: (userId: string) => void
}

export function BlockedUsersModal({
  isOpen,
  onClose,
  blockedUserIds,
  allStudents,
  onUnblockUser,
}: BlockedUsersModalProps) {
  const blockedStudents = allStudents.filter((s) =>
    blockedUserIds.includes(s.id),
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy, Safety & Blocked Accounts"
      subtitle="Manage accounts you have restricted from contacting you or viewing your profile"
      maxWidth="md"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-[#173a35] text-white rounded text-xs font-semibold"
        >
          Done
        </button>
      }
    >
      <div className="space-y-4 text-xs text-[#242b29]">
        <div className="p-3 bg-[#f7f5ef] rounded border border-[#d8ddd8] flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-[#173a35] shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[#62736b]">
            Blocked accounts cannot see your posts, send connection requests, or
            message you. They will not be notified that you have blocked them.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#173a35] mb-2.5">
            Currently Blocked Accounts ({blockedStudents.length})
          </h4>

          {blockedStudents.length === 0 ? (
            <p className="text-[#728078] py-4 text-center italic">
              You haven't blocked any student accounts.
            </p>
          ) : (
            <div className="divide-y divide-[#eef2ef] border border-[#cbd3ce] rounded bg-white overflow-hidden">
              {blockedStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-8 h-8 rounded object-cover border border-[#cbd3ce]"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-[#173a35] truncate">
                        {student.name}
                      </p>
                      <p className="text-[10px] text-[#62736b] truncate">
                        {student.institution}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onUnblockUser(student.id)}
                    className="px-2.5 py-1 text-xs border border-[#cbd3ce] rounded hover:border-[#173a35] hover:text-[#173a35] font-semibold transition-colors"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
