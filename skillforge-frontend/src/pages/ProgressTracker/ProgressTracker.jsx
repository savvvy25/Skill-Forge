import { useState } from 'react';
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCloseLine,
  RiAlertLine,
  RiCodeBoxLine,
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useProgress } from '../../hooks/useProgress';
import { DSA_TOPICS } from '../../utils/constants';
import styles from './ProgressTracker.module.css';

const toastStyle = {
  style: { background: '#1a1f35', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.08)' },
};
const toastSuccess = {
  style: { background: '#1a1f35', color: '#f1f5f9', border: '1px solid rgba(16,185,129,0.3)' },
  iconTheme: { primary: '#10b981', secondary: '#1a1f35' },
};
const toastError = {
  style: { background: '#1a1f35', color: '#f1f5f9', border: '1px solid rgba(239,68,68,0.3)' },
  iconTheme: { primary: '#ef4444', secondary: '#1a1f35' },
};

function ProgressTracker() {
  const {
    progress,
    loading,
    addProgress,
    updateProgress,
    deleteProgress,
  } = useProgress();

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    topic: '',
    easy: 0,
    medium: 0,
    hard: 0,
  });

  // Topics already added (for filtering in Add mode)
  const usedTopics = progress.map((p) => p.topic);
  const availableTopics = DSA_TOPICS.filter((t) => !usedTopics.includes(t));

  const openAddModal = () => {
    setEditItem(null);
    setFormData({ topic: '', easy: 0, medium: 0, hard: 0 });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setFormData({
      topic: item.topic,
      easy: item.easy || item.easySolved || 0,
      medium: item.medium || item.mediumSolved || 0,
      hard: item.hard || item.hardSolved || 0,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setFormData({ topic: '', easy: 0, medium: 0, hard: 0 });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'topic' ? value : Math.max(0, parseInt(value, 10) || 0),
    }));
  };

  const handleSave = async () => {
    if (!formData.topic) {
      toast.error('Please select a topic', toastError);
      return;
    }

    setSaving(true);
    try {
      if (editItem) {
        const id = editItem._id || editItem.id;
        await updateProgress(id, {
          topic: formData.topic,
          easy: formData.easy,
          medium: formData.medium,
          hard: formData.hard,
        });
        toast.success('Progress updated!', toastSuccess);
      } else {
        await addProgress({
          topic: formData.topic,
          easy: formData.easy,
          medium: formData.medium,
          hard: formData.hard,
        });
        toast.success('Progress added!', toastSuccess);
      }
      closeModal();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save progress';
      toast.error(message, toastError);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteItem(item);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    setSaving(true);
    try {
      const id = deleteItem._id || deleteItem.id;
      await deleteProgress(id);
      toast.success('Progress deleted', toastSuccess);
      setDeleteItem(null);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete';
      toast.error(message, toastError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Progress Tracker</h1>
        <button className={styles.addBtn} onClick={openAddModal}>
          <span className={styles.addBtnText}>
            <RiAddLine size={18} />
            Add Progress
          </span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles.tableContainer}>
          <div className={styles.loadingTable}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.loadingRow} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && progress.length === 0 && (
        <div className={styles.tableContainer}>
          <div className={styles.emptyState}>
            <RiCodeBoxLine className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No progress tracked yet</h3>
            <p className={styles.emptyText}>
              Start adding your DSA topics to track your journey
            </p>
            <button className={styles.emptyBtn} onClick={openAddModal}>
              <RiAddLine />
              Add Your First Topic
            </button>
          </div>
        </div>
      )}

      {/* Progress Table */}
      {!loading && progress.length > 0 && (
        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Easy</th>
                  <th>Medium</th>
                  <th>Hard</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {progress.map((item, index) => {
                  const easy = item.easy || item.easySolved || 0;
                  const medium = item.medium || item.mediumSolved || 0;
                  const hard = item.hard || item.hardSolved || 0;
                  const total = easy + medium + hard;

                  return (
                    <tr key={item._id || item.id || index}>
                      <td>
                        <span className={styles.topicName}>{item.topic}</span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeEasy}`}>
                          {easy}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeMedium}`}>
                          {medium}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeHard}`}>
                          {hard}
                        </span>
                      </td>
                      <td>
                        <span className={styles.totalCount}>{total}</span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={`${styles.actionBtn} ${styles.editActionBtn}`}
                            onClick={() => openEditModal(item)}
                            title="Edit"
                          >
                            <RiEditLine />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteActionBtn}`}
                            onClick={() => handleDeleteClick(item)}
                            title="Delete"
                          >
                            <RiDeleteBinLine />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editItem ? 'Edit Progress' : 'Add Progress'}
              </h2>
              <button className={styles.modalCloseBtn} onClick={closeModal}>
                <RiCloseLine />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>DSA Topic</label>
                <select
                  name="topic"
                  className={styles.modalSelect}
                  value={formData.topic}
                  onChange={handleFormChange}
                  disabled={!!editItem}
                >
                  <option value="">Select a topic</option>
                  {(editItem
                    ? DSA_TOPICS
                    : availableTopics
                  ).map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.countsRow}>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>
                    <span className={styles.countLabel}>
                      <span
                        className={styles.countDot}
                        style={{ background: '#10b981' }}
                      />
                      Easy
                    </span>
                  </label>
                  <input
                    type="number"
                    name="easy"
                    className={styles.modalInput}
                    min="0"
                    value={formData.easy}
                    onChange={handleFormChange}
                  />
                </div>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>
                    <span className={styles.countLabel}>
                      <span
                        className={styles.countDot}
                        style={{ background: '#f59e0b' }}
                      />
                      Medium
                    </span>
                  </label>
                  <input
                    type="number"
                    name="medium"
                    className={styles.modalInput}
                    min="0"
                    value={formData.medium}
                    onChange={handleFormChange}
                  />
                </div>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>
                    <span className={styles.countLabel}>
                      <span
                        className={styles.countDot}
                        style={{ background: '#ef4444' }}
                      />
                      Hard
                    </span>
                  </label>
                  <input
                    type="number"
                    name="hard"
                    className={styles.modalInput}
                    min="0"
                    value={formData.hard}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalCancelBtn} onClick={closeModal}>
                Cancel
              </button>
              <button
                className={styles.modalSaveBtn}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving…' : editItem ? 'Update' : 'Add Progress'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteItem && (
        <div
          className={styles.modalOverlay}
          onClick={() => setDeleteItem(null)}
        >
          <div
            className={`${styles.modal} ${styles.deleteModal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.deleteBody}>
              <RiAlertLine className={styles.deleteIcon} />
              <h3 className={styles.deleteTitle}>Delete Progress</h3>
              <p className={styles.deleteText}>
                Are you sure you want to delete progress for{' '}
                <strong>{deleteItem.topic}</strong>? This action cannot be undone.
              </p>
              <div className={styles.deleteActions}>
                <button
                  className={styles.modalCancelBtn}
                  onClick={() => setDeleteItem(null)}
                >
                  Cancel
                </button>
                <button
                  className={styles.deleteConfirmBtn}
                  onClick={handleDeleteConfirm}
                  disabled={saving}
                >
                  {saving ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressTracker;
