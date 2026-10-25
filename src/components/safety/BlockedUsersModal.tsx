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
          className="btn-3d-primary px-5 py-2 text-xs font-semibold"
        >
          Done
        </button>
      }
    >
      <div className="space-y-4 text-xs text-[#242b29]">
        <div className="p-3 bg-[#f7f5ef] rounded-2xl border border-[#d8ddd8]/60 flex items-start gap-2.5 shadow-2xs">
          <Shield className="w-4 h-4 text-[#173a35] shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[#62736b]">
            Blocked accounts cannot see your posts, send connection requests, or
            message you. They will not be notified that you have blocked them.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-xs text-[#173a35] mb-2.5">
            Currently Blocked Accounts ({blockedStudents.length})
          </h4>

          {blockedStudents.length === 0 ? (
            <p className="text-[#728078] py-4 text-center italic">
              You haven't blocked any student accounts.
            </p>
          ) : (
            <div className="divide-y divide-[#eef2ef] border border-[#cbd3ce]/60 rounded-2xl bg-white overflow-hidden shadow-2xs">
              {blockedStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-9 h-9 rounded-full object-cover shadow-2xs border border-white"
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
                    className="btn-3d-secondary px-3 py-1.5 text-xs font-semibold"
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
