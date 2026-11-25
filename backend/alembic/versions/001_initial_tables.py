"""Initial tables for InternTrack

Revision ID: 001_initial_tables
Revises: 
Create Date: 2026-11-25 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '001_initial_tables'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # 1. users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=100), nullable=False),
        sa.Column('college', sa.String(length=150), nullable=True),
        sa.Column('degree', sa.String(length=100), nullable=True),
        sa.Column('graduation_year', sa.Integer(), nullable=True),
        sa.Column('target_role', sa.String(length=100), nullable=True),
        sa.Column('preferred_locations', sa.String(length=255), nullable=True),
        sa.Column('preferred_work_mode', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # 2. applications table
    op.create_table(
        'applications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('company_name', sa.String(length=100), nullable=False),
        sa.Column('job_title', sa.String(length=100), nullable=False),
        sa.Column('job_description', sa.Text(), nullable=True),
        sa.Column('company_website', sa.String(length=255), nullable=True),
        sa.Column('application_url', sa.String(length=255), nullable=True),
        sa.Column('location', sa.String(length=100), nullable=True),
        sa.Column('work_mode', sa.String(length=50), nullable=False),
        sa.Column('employment_type', sa.String(length=50), nullable=False),
        sa.Column('salary', sa.String(length=100), nullable=True),
        sa.Column('application_date', sa.DateTime(), nullable=False),
        sa.Column('deadline', sa.DateTime(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('recruiter_name', sa.String(length=100), nullable=True),
        sa.Column('recruiter_email', sa.String(length=100), nullable=True),
        sa.Column('interview_date', sa.DateTime(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('resume_version', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_applications_company_name'), 'applications', ['company_name'], unique=False)
    op.create_index(op.f('ix_applications_id'), 'applications', ['id'], unique=False)
    op.create_index(op.f('ix_applications_job_title'), 'applications', ['job_title'], unique=False)
    op.create_index(op.f('ix_applications_status'), 'applications', ['status'], unique=False)
    op.create_index(op.f('ix_applications_user_id'), 'applications', ['user_id'], unique=False)

    # 3. interviews table
    op.create_table(
        'interviews',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('application_id', sa.Integer(), nullable=False),
        sa.Column('interview_type', sa.String(length=50), nullable=False),
        sa.Column('interview_date', sa.DateTime(), nullable=False),
        sa.Column('meeting_link', sa.String(length=255), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('preparation_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['application_id'], ['applications.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_interviews_application_id'), 'interviews', ['application_id'], unique=False)
    op.create_index(op.f('ix_interviews_id'), 'interviews', ['id'], unique=False)
    op.create_index(op.f('ix_interviews_interview_date'), 'interviews', ['interview_date'], unique=False)
    op.create_index(op.f('ix_interviews_user_id'), 'interviews', ['user_id'], unique=False)

    # 4. reminders table
    op.create_table(
        'reminders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('application_id', sa.Integer(), nullable=True),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('due_date', sa.DateTime(), nullable=False),
        sa.Column('is_completed', sa.Boolean(), nullable=False),
        sa.Column('priority', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['application_id'], ['applications.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_reminders_application_id'), 'reminders', ['application_id'], unique=False)
    op.create_index(op.f('ix_reminders_due_date'), 'reminders', ['due_date'], unique=False)
    op.create_index(op.f('ix_reminders_id'), 'reminders', ['id'], unique=False)
    op.create_index(op.f('ix_reminders_user_id'), 'reminders', ['user_id'], unique=False)

    # 5. notes table
    op.create_table(
        'notes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('application_id', sa.Integer(), nullable=True),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['application_id'], ['applications.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notes_application_id'), 'notes', ['application_id'], unique=False)
    op.create_index(op.f('ix_notes_id'), 'notes', ['id'], unique=False)
    op.create_index(op.f('ix_notes_user_id'), 'notes', ['user_id'], unique=False)

def downgrade() -> None:
    op.drop_table('notes')
    op.drop_table('reminders')
    op.drop_table('interviews')
    op.drop_table('applications')
    op.drop_table('users')
