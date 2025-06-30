
import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, Clock, DollarSign, FolderOpen, CheckCircle, XCircle } from 'lucide-react';
import { useFinancial } from '@/context/FinancialContext';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/currency';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusColors = {
  'planning': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'in-progress': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'completed': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  'on-hold': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const paymentStatusColors = {
  'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'collected': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
};

const Projects: React.FC = () => {
  const { 
    projects, 
    addProject, 
    updateProject, 
    deleteProject, 
    getTotalProjectValue,
    getCollectedProjectValue,
    getPendingProjectValue,
    getActiveProjects,
    getCompletedProjects,
    settings 
  } = useFinancial();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    price: '',
    timePeriod: '',
    status: 'planning' as any,
    startDate: '',
    endDate: '',
    paymentStatus: 'pending' as any
  });

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProjectValue = getTotalProjectValue();
  const collectedValue = getCollectedProjectValue();
  const pendingValue = getPendingProjectValue();
  const activeProjects = getActiveProjects();
  const completedProjects = getCompletedProjects();

  const handleAddProject = () => {
    if (!newProject.name || !newProject.description || !newProject.price || !newProject.timePeriod || !newProject.startDate || !newProject.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const project = {
      name: newProject.name,
      description: newProject.description,
      price: parseFloat(newProject.price),
      timePeriod: newProject.timePeriod,
      status: newProject.status,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      paymentStatus: newProject.paymentStatus
    };

    addProject(project);
    toast({
      title: "Success",
      description: "Project added successfully",
    });

    setShowAddModal(false);
    setNewProject({
      name: '',
      description: '',
      price: '',
      timePeriod: '',
      status: 'planning',
      startDate: '',
      endDate: '',
      paymentStatus: 'pending'
    });
  };

  const handleEditProject = () => {
    if (!editingProject || !editingProject.name || !editingProject.description || !editingProject.price || !editingProject.timePeriod || !editingProject.startDate || !editingProject.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    updateProject(editingProject._id, editingProject);
    toast({
      title: "Success",
      description: "Project updated successfully",
    });
    setEditingProject(null);
  };

  const handleDeleteProject = (id: number) => {
    deleteProject(id);
    toast({
      title: "Success",
      description: "Project deleted successfully",
    });
  };

  const togglePaymentStatus = (project: any) => {
    const newPaymentStatus = project.paymentStatus === 'pending' ? 'collected' : 'pending';
    updateProject(project._id, { paymentStatus: newPaymentStatus });
    toast({
      title: "Success",
      description: `Payment status updated to ${newPaymentStatus}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Project Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage all your business projects</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-100 text-sm font-medium">Total Projects</h3>
              <p className="text-3xl font-bold mt-2">{projects.length}</p>
            </div>
            <FolderOpen className="h-8 w-8 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-emerald-100 text-sm font-medium">Total Value</h3>
              <p className="text-3xl font-bold mt-2">{formatCurrency(totalProjectValue, settings.currency)}</p>
            </div>
            <DollarSign className="h-8 w-8 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-100 text-sm font-medium">Collected</h3>
              <p className="text-3xl font-bold mt-2">{formatCurrency(collectedValue, settings.currency)}</p>
            </div>
            <CheckCircle className="h-8 w-8 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-orange-100 text-sm font-medium">Active</h3>
              <p className="text-3xl font-bold mt-2">{activeProjects}</p>
            </div>
            <Clock className="h-8 w-8 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-purple-100 text-sm font-medium">Completed</h3>
              <p className="text-3xl font-bold mt-2">{completedProjects}</p>
            </div>
            <Calendar className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project._id || project.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{project.name}</h3>
                  <div className="flex flex-col gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                      {project.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[project.paymentStatus]}`}>
                      {project.paymentStatus}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Value:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(project.price, settings.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                    <span className="text-gray-900 dark:text-gray-100">{project.timePeriod}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Start:</span>
                    <span className="text-gray-900 dark:text-gray-100">{project.startDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">End:</span>
                    <span className="text-gray-900 dark:text-gray-100">{project.endDate}</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditingProject(project)}
                      className="flex-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center justify-center space-x-1 py-2 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="flex-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium flex items-center justify-center space-x-1 py-2 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProject(project._id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <button 
                    onClick={() => togglePaymentStatus(project)}
                    className={`w-full text-sm font-medium flex items-center justify-center space-x-1 py-2 rounded-lg transition-colors ${
                      project.paymentStatus === 'pending' 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    }`}
                  >
                    {project.paymentStatus === 'pending' ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Mark as Collected</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        <span>Mark as Pending</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Add New Project</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project Name"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <textarea
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Project Value"
                value={newProject.price}
                onChange={(e) => setNewProject({...newProject, price: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Time Period (e.g., 3 months)"
                value={newProject.timePeriod}
                onChange={(e) => setNewProject({...newProject, timePeriod: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({...newProject, status: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
              <select
                value={newProject.paymentStatus}
                onChange={(e) => setNewProject({...newProject, paymentStatus: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="pending">Payment Pending</option>
                <option value="collected">Payment Collected</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Edit Project</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project Name"
                value={editingProject.name}
                onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <textarea
                placeholder="Project Description"
                value={editingProject.description}
                onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Project Value"
                value={editingProject.price}
                onChange={(e) => setEditingProject({...editingProject, price: parseFloat(e.target.value) || 0})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Time Period (e.g., 3 months)"
                value={editingProject.timePeriod}
                onChange={(e) => setEditingProject({...editingProject, timePeriod: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={editingProject.startDate}
                  onChange={(e) => setEditingProject({...editingProject, startDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="date"
                  value={editingProject.endDate}
                  onChange={(e) => setEditingProject({...editingProject, endDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <select
                value={editingProject.status}
                onChange={(e) => setEditingProject({...editingProject, status: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
              <select
                value={editingProject.paymentStatus}
                onChange={(e) => setEditingProject({...editingProject, paymentStatus: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="pending">Payment Pending</option>
                <option value="collected">Payment Collected</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditProject}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all"
              >
                Update Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
