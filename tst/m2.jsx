import React, { Component } from 'react';
import { ChevronDown, ChevronUp, Plus, X, Search } from 'lucide-react';

// Status Editor Component
class StatusEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newStatusName: '',
      newStatusColor: '#666666'
    };
    this.ref = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.ref.current && !this.ref.current.contains(event.target)) {
      this.props.onClose();
    }
  }

  addNewStatus() {
    const name = this.state.newStatusName.trim();
    if (!name) return;

    const id = name.toLowerCase().replace(/\s+/g, '-');
    if (this.props.statuses.some(s => s.id === id)) {
      alert('Status with this name already exists.');
      return;
    }

    const newStatus = { id, name, color: this.state.newStatusColor };
    this.props.onUpdate(newStatus.id, [...this.props.statuses, newStatus]);
    this.setState({ newStatusName: '', newStatusColor: '#666666' });
  }

  render() {
    const { statuses, onUpdate } = this.props;
    
    return (
      <div 
        ref={this.ref}
        className="absolute z-50 bg-gray-900 border border-gray-500 rounded-lg p-3 shadow-2xl min-w-48 top-8 left-0"
        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.9)' }}
      >
        <div className="space-y-2 mb-3">
          {statuses.map((status) => (
            <button
              key={status.id}
              onClick={() => onUpdate(status.id, statuses)}
              className="flex items-center space-x-2 w-full text-left hover:bg-gray-800 p-2 rounded transition-all duration-150"
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: status.color,
                  boxShadow: `0 0 8px ${status.color}60`
                }}
              />
              <span className="text-white text-sm">{status.name}</span>
            </button>
          ))}
        </div>
        
        <div className="border-t border-gray-600 pt-3">
          <input
            type="text"
            value={this.state.newStatusName}
            onChange={(e) => this.setState({ newStatusName: e.target.value })}
            placeholder="new status"
            className="bg-gray-950 text-white px-3 py-2 rounded text-sm w-full mb-3 border border-gray-600 focus:border-blue-400 transition-colors"
          />
          <div className="flex items-center space-x-2 mb-3">
            <input
              type="color"
              value={this.state.newStatusColor}
              onChange={(e) => this.setState({ newStatusColor: e.target.value })}
              className="w-8 h-8 rounded border border-gray-600"
            />
            <input
              type="text"
              value={this.state.newStatusColor}
              onChange={(e) => this.setState({ newStatusColor: e.target.value })}
              className="bg-gray-950 text-white px-3 py-2 rounded text-sm flex-1 border border-gray-600 focus:border-blue-400 transition-colors"
              placeholder="#hex"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => this.addNewStatus()}
              className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex-1 transition-all duration-200"
            >
              add
            </button>
            <button
              onClick={this.props.onClose}
              className="bg-gray-700 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// Delete Dialog Component
class DeleteDialog extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.ref.current && !this.ref.current.contains(event.target)) {
      this.props.onCancel();
    }
  }

  render() {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div 
          ref={this.ref}
          className="bg-gray-900 border border-gray-500 rounded-lg p-6 shadow-2xl"
        >
          <h3 className="text-white text-lg font-bold mb-3">delete entry?</h3>
          <p className="text-gray-300 text-sm mb-6">this action cannot be undone</p>
          <div className="flex space-x-3">
            <button
              onClick={this.props.onConfirm}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-all duration-200"
            >
              delete
            </button>
            <button
              onClick={this.props.onCancel}
              className="bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 transition-all duration-200"
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// Search Bar Component
class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isVisible && !prevProps.isVisible && this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  render() {
    if (!this.props.isVisible) return null;

    return (
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={this.inputRef}
            type="text"
            value={this.props.searchTerm}
            onChange={(e) => this.props.setSearchTerm(e.target.value)}
            placeholder="search in all entries..."
            className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-500 focus:border-blue-400 transition-colors text-sm"
          />
        </div>
      </div>
    );
  }
}

// Editable Field Component
class EditableField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      editValue: props.value || ''
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ editValue: this.props.value || '' });
    }
  }

  handleSave() {
    this.props.onChange(this.state.editValue);
    this.setState({ isEditing: false });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleSave();
    } else if (e.key === 'Escape') {
      this.setState({ 
        editValue: this.props.value || '',
        isEditing: false 
      });
    }
  }

  render() {
    const { placeholder, className = '' } = this.props;
    
    if (this.state.isEditing) {
      return (
        <input
          type="text"
          value={this.state.editValue}
          onChange={(e) => this.setState({ editValue: e.target.value })}
          onKeyDown={(e) => this.handleKeyDown(e)}
          onBlur={() => this.handleSave()}
          className={`bg-transparent text-white outline-none ${className}`}
          placeholder={placeholder}
          autoFocus
        />
      );
    }

    return (
      <span
        onClick={() => this.setState({ isEditing: true, editValue: this.props.value || '' })}
        className={`cursor-pointer hover:bg-gray-800 hover:bg-opacity-70 rounded px-2 py-1 transition-all duration-200 ${className}`}
        title="Click to edit"
      >
        {this.props.value || placeholder}
      </span>
    );
  }
}

// Timeline Item Component
class TimelineItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      showDeleteDialog: false
    };
  }

  matchesSearch() {
    if (!this.props.searchTerm) return true;
    const searchLower = this.props.searchTerm.toLowerCase();
    const searchFields = [
      this.props.item.version,
      ...(this.props.item.details || []).map(d => typeof d === 'string' ? d : d.text)
    ].filter(Boolean);
    
    return searchFields.some(field => field.toLowerCase().includes(searchLower));
  }

  getCurrentStatus() {
    return this.props.statuses.find(s => s.id === this.props.item.status) || this.props.statuses[0];
  }

  calculateProgress() {
    if (!this.props.item.details || this.props.item.details.length === 0) return null;
    const details = this.props.item.details.map(d => typeof d === 'string' ? { text: d, completed: false } : d);
    const completed = details.filter(d => d.completed).length;
    return `${completed}/${details.length}`;
  }

  handleStatusUpdate(newStatusId, newStatuses) {
    this.props.onStatusUpdate(newStatuses);
    this.props.onUpdate(this.props.index, { ...this.props.item, status: newStatusId });
    this.props.setEditingStatusIndex(null);
  }

  updateField(field, value) {
    this.props.onUpdate(this.props.index, { ...this.props.item, [field]: value });
  }

  addDetail() {
    const newDetails = [...(this.props.item.details || []), { text: 'new detail', completed: false }];
    this.props.onUpdate(this.props.index, { ...this.props.item, details: newDetails });
    this.setState({ isExpanded: true });
  }

  updateDetail(detailIndex, field, value) {
    let newDetails = [...(this.props.item.details || [])];
    if (typeof newDetails[detailIndex] === 'string') {
      newDetails[detailIndex] = { text: newDetails[detailIndex], completed: false };
    }
    newDetails[detailIndex] = { ...newDetails[detailIndex], [field]: value };
    this.props.onUpdate(this.props.index, { ...this.props.item, details: newDetails });
  }

  removeDetail(detailIndex) {
    const newDetails = this.props.item.details.filter((_, idx) => idx !== detailIndex);
    this.props.onUpdate(this.props.index, { 
      ...this.props.item, 
      details: newDetails.length > 0 ? newDetails : undefined 
    });
  }

  toggleDetailCompletion(detailIndex) {
    let newDetails = [...(this.props.item.details || [])];
    if (typeof newDetails[detailIndex] === 'string') {
      newDetails[detailIndex] = { text: newDetails[detailIndex], completed: false };
    }
    newDetails[detailIndex] = { 
      ...newDetails[detailIndex], 
      completed: !newDetails[detailIndex].completed 
    };
    this.props.onUpdate(this.props.index, { ...this.props.item, details: newDetails });
  }

  render() {
    if (!this.matchesSearch()) return null;
    
    const { item, index, editingStatusIndex, setEditingStatusIndex } = this.props;
    const isEditingStatus = editingStatusIndex === index;
    const currentStatus = this.getCurrentStatus();
    const displayProgress = this.calculateProgress();

    return (
      <>
        <div className="relative">
          {index > 0 && (
            <div 
              className="absolute w-0.5 h-4 rounded-full z-0"
              style={{ 
                left: '5px',
                top: '-16px',
                backgroundColor: '#6b7280',
                opacity: '0.6'
              }}
            />
          )}
          
          <div 
            className="group bg-gray-900 rounded-lg p-4 mb-3 border border-gray-500 transition-all duration-300 hover:border-gray-400 hover:shadow-lg relative z-10"
          >
            <button
              onClick={() => this.setState({ showDeleteDialog: true })}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0 mt-0.5">
                  <div 
                    className="w-3 h-3 rounded-full opacity-25 absolute inset-0 transition-all duration-300"
                    style={{ backgroundColor: currentStatus.color }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingStatusIndex(isEditingStatus ? null : index);
                    }}
                    className="w-3 h-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 relative z-10"
                    style={{ 
                      backgroundColor: currentStatus.color,
                      boxShadow: `0 0 8px ${currentStatus.color}60`
                    }}
                  />
                  {isEditingStatus && (
                    <StatusEditor
                      statuses={this.props.statuses}
                      onUpdate={(newStatusId, newStatuses) => this.handleStatusUpdate(newStatusId, newStatuses)}
                      onClose={() => setEditingStatusIndex(null)}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <EditableField
                    value={item.version}
                    onChange={(value) => this.updateField('version', value)}
                    placeholder="main title"
                    className="text-white text-sm leading-tight block opacity-95"
                  />
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    this.setState({ isExpanded: !this.state.isExpanded });
                  }}
                  className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
                >
                  {this.state.isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {displayProgress && (
                  <span className="text-gray-400 text-xs">{displayProgress}</span>
                )}
              </div>
            </div>
            
            {this.state.isExpanded && (
              <div className="mt-4 ml-6 space-y-2">
                {item.details && item.details.map((detail, idx) => {
                  const detailObj = typeof detail === 'string' ? { text: detail, completed: false } : detail;
                  return (
                    <div key={idx} className="flex items-center space-x-3">
                      <button
                        onClick={() => this.toggleDetailCompletion(idx)}
                        className={`w-2.5 h-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-125 flex-shrink-0 ${
                          detailObj.completed ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{
                          boxShadow: `0 0 6px ${detailObj.completed ? '#10b981' : '#ef4444'}60`
                        }}
                      />
                      <div className="bg-gray-800 rounded-lg p-3 flex-1 border border-gray-600 min-w-0 hover:border-gray-500 transition-all duration-200">
                        <EditableField
                          value={detailObj.text}
                          onChange={(value) => this.updateDetail(idx, 'text', value)}
                          placeholder="detail text"
                          className="text-gray-300 text-sm block w-full opacity-90"
                        />
                      </div>
                      <button
                        onClick={() => this.removeDetail(idx)}
                        className="text-red-400 hover:text-red-300 flex-shrink-0 transition-all duration-200 hover:scale-110"
                        title="Remove detail"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5" />
                  <button
                    onClick={() => this.addDetail()}
                    className="bg-gray-800 border border-gray-600 border-dashed text-gray-400 hover:text-white hover:border-gray-500 transition-all duration-300 rounded-lg p-3 flex-1 text-sm hover:scale-105"
                  >
                    + add detail
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {this.state.showDeleteDialog && (
          <DeleteDialog
            onConfirm={() => {
              this.props.onDelete(index);
              this.setState({ showDeleteDialog: false });
            }}
            onCancel={() => this.setState({ showDeleteDialog: false })}
          />
        )}
      </>
    );
  }
}

// Main Component
class InteractiveTimeline extends Component {
  constructor(props) {
    super(props);
    
    const initialStatuses = [
      { id: 'planned', name: 'planned', color: '#6b7280' },
      { id: 'in-progress', name: 'in progress', color: '#ec4899' },
      { id: 'complete', name: 'complete', color: '#10b981' }
    ];

    let statuses = initialStatuses;
    try {
      const savedStatuses = localStorage.getItem('cuelog-statuses');
      if (savedStatuses) {
        statuses = JSON.parse(savedStatuses);
      }
    } catch (e) {
      console.error('Failed to load statuses:', e);
    }

    const initialData = [
      {
        version: "first entry",
        status: "complete"
      },
      {
        version: "learning the ropes", 
        status: "in-progress",
        details: [
          { text: "understanding the interface", completed: true },
          { text: "creating timeline entries", completed: true }, 
          { text: "organizing thoughts", completed: false }
        ]
      }
    ];

    let savedData = initialData;
    let savedHistory = [initialData];
    let savedIndex = 0;

    try {
      const saved = localStorage.getItem('cuelog-data');
      const savedHistoryData = localStorage.getItem('cuelog-history');
      const savedIndexData = localStorage.getItem('cuelog-index');
      
      if (saved) {
        savedData = JSON.parse(saved);
        savedHistory = savedHistoryData ? JSON.parse(savedHistoryData) : [savedData];
        savedIndex = savedIndexData ? parseInt(savedIndexData) : 0;
      }
    } catch (e) {
      console.error('Failed to load data:', e);
    }

    this.state = {
      timelineData: savedData,
      history: savedHistory,
      historyIndex: savedIndex,
      statuses,
      editingStatusIndex: null,
      showSearch: false,
      searchTerm: ''
    };
  }

  saveData(newData) {
    try {
      localStorage.setItem('cuelog-data', JSON.stringify(newData));
      
      const newHistory = [...this.state.history.slice(0, this.state.historyIndex + 1), newData];
      const trimmedHistory = newHistory.slice(-20);
      
      localStorage.setItem('cuelog-history', JSON.stringify(trimmedHistory));
      localStorage.setItem('cuelog-index', (trimmedHistory.length - 1).toString());
      
      this.setState({
        timelineData: newData,
        history: trimmedHistory,
        historyIndex: trimmedHistory.length - 1
      });
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }

  undo() {
    if (this.state.historyIndex > 0) {
      const newIndex = this.state.historyIndex - 1;
      const undoData = this.state.history[newIndex];
      
      localStorage.setItem('cuelog-data', JSON.stringify(undoData));
      localStorage.setItem('cuelog-index', newIndex.toString());
      
      this.setState({
        timelineData: undoData,
        historyIndex: newIndex
      });
    }
  }

  redo() {
    if (this.state.historyIndex < this.state.history.length - 1) {
      const newIndex = this.state.historyIndex + 1;
      const redoData = this.state.history[newIndex];
      
      localStorage.setItem('cuelog-data', JSON.stringify(redoData));
      localStorage.setItem('cuelog-index', newIndex.toString());
      
      this.setState({
        timelineData: redoData,
        historyIndex: newIndex
      });
    }
  }

  updateItem(index, newData) {
    const newTimeline = [...this.state.timelineData];
    newTimeline[index] = newData;
    this.saveData(newTimeline);
  }

  deleteItem(index) {
    const newTimeline = this.state.timelineData.filter((_, idx) => idx !== index);
    this.saveData(newTimeline);
  }

  addNewItem() {
    const newItem = {
      version: "new entry",
      status: "planned"
    };
    this.saveData([...this.state.timelineData, newItem]);
  }

  handleStatusUpdate(newStatuses) {
    try {
      localStorage.setItem('cuelog-statuses', JSON.stringify(newStatuses));
    } catch (e) {
      console.error('Failed to save statuses:', e);
    }
    this.setState({ statuses: newStatuses });
  }

  render() {
    const canUndo = this.state.historyIndex > 0;
    const canRedo = this.state.historyIndex < this.state.history.length - 1;

    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">cuelog</h1>
                <p className="text-gray-400">its log, its not</p>
              </div>
              <button
                onClick={() => this.setState({ showSearch: !this.state.showSearch })}
                className="bg-gray-900 px-3 py-2 rounded-lg border border-gray-500 transition-all duration-200 hover:border-gray-400 hover:scale-105"
              >
                <span className="text-gray-300 text-sm">i:{this.state.timelineData.length}</span>
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => this.undo()}
                disabled={!canUndo}
                className="bg-gray-900 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed px-3 py-2 rounded-lg border border-gray-500 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                &lt;
              </button>
              <button
                onClick={() => this.redo()}
                disabled={!canRedo}
                className="bg-gray-900 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed px-3 py-2 rounded-lg border border-gray-500 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                &gt;
              </button>
            </div>
          </div>

          <SearchBar 
            searchTerm={this.state.searchTerm} 
            setSearchTerm={(term) => this.setState({ searchTerm: term })} 
            isVisible={this.state.showSearch} 
          />
          
          <div className="space-y-0">
            {this.state.timelineData.map((item, index) => (
              <TimelineItem 
                key={index} 
                item={item} 
                index={index} 
                onUpdate={(index, newData) => this.updateItem(index, newData)}
                onDelete={(index) => this.deleteItem(index)}
                statuses={this.state.statuses}
                onStatusUpdate={(newStatuses) => this.handleStatusUpdate(newStatuses)}
                editingStatusIndex={this.state.editingStatusIndex}
                setEditingStatusIndex={(index) => this.setState({ editingStatusIndex: index })}
                searchTerm={this.state.searchTerm}
              />
            ))}
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => this.addNewItem()}
              className="w-full bg-gray-900 border border-gray-500 border-dashed text-gray-400 hover:text-white hover:border-gray-400 transition-all duration-300 rounded-lg p-4 flex items-center justify-center space-x-2 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>add new entry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default InteractiveTimeline;