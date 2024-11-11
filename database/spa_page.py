import safrs
import flask_sqlalchemy
import os
import json
import subprocess

from sqlalchemy import Column, DECIMAL, DateTime, ForeignKey, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from database.system.SAFRSBaseX import SAFRSBaseX
from flask_login import UserMixin
from safrs import jsonapi_attr, jsonapi_rpc
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped
from sqlalchemy.sql.sqltypes import NullType
from sqlalchemy import func
from typing import List
from pathlib import Path
from sqlalchemy.sql import func
from ulid import ULID
from safrs.util import classproperty
from flask import g, has_request_context, abort, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required, JWTManager, get_jwt, verify_jwt_in_request
from sqlalchemy import create_engine, text
import logging 
from werkzeug.utils import secure_filename
from pathlib import Path
from sqlalchemy.dialects.sqlite import *
from config.config import Config
import subprocess
from .models import Base, SAFRSBaseX

GEN_COMPONENT_SCRIPT = '/opt/webgenai/simple-spa/src/gen_component.py'
PROJ_ROOT = Path(os.getenv("PROJ_ROOT","/opt/projects"))
ULID_ROOT = PROJ_ROOT / "by-ulid" 

class BaseModel(SAFRSBaseX, Base):
    __abstract__ = True


class SPASection(BaseModel):
    __tablename__ = 'spa_sections'
    _s_collection_name = 'SPASection'
    
    id = Column(String, primary_key=True)
    name = Column(Text, nullable=False)
    title = Column(Text)
    subtitle = Column(Text)
    label = Column(Text)
    Type = Column(Text)
    paragraph = Column(Text)
    content = Column(Text)
    #style = Column(JSON)
    background = Column(Text)
    template = Column(Text)
    order = Column(Integer, default=-1)
    hidden = Column(Boolean, default=False)
    
    page_id = Column(ForeignKey('spa_pages.id'))
    page : Mapped["SPAPage"] = relationship(back_populates=("SectionList"))


class SPAPage(BaseModel):
    __tablename__ = 'spa_pages'
    _s_collection_name = 'SPAPage'
    
    id = Column(String, primary_key=True)
    name = Column(Text, nullable=False)
    contact = Column(Text, nullable=False)
    SectionList : Mapped[List["SPASection"]] = relationship(back_populates="page")


class SPAComponent(BaseModel):
    __tablename__ = 'spa_components'
    _s_collection_name = 'SPAComponent'
    
    id = Column(String, primary_key=True)
    prompt = Column(Text, nullable=False)
    name = Column(Text)
    code = Column(Text)
    user_comments = Column(Text)
    ai_comments = Column(Text)
    created_at = Column(DateTime, default=func.now())
    
    section_id = Column(ForeignKey('spa_sections.id'))
    parent_id = Column(ForeignKey('spa_components.id'))
    parent : Mapped["SPAComponent"] = relationship(back_populates=("ChildList"))
    parent: Mapped["SPAComponent"] = relationship('SPAComponent', remote_side=[id], backref='ChildList')
    
    def __init__(self, *args, **kwargs):
        safrs.log.info(f"Generating component {kwargs}")
        kwargs['id'] = self.id = str(ULID())
        project_id = kwargs.get('project_id')
        if not project_id:
            raise Exception("project_id is required")
        prompt = kwargs.get('prompt')
        if not prompt:
            raise Exception("prompt is required")
        if not project_id in os.listdir(ULID_ROOT) and not project_id in __file__:
            raise Exception("project_id is invalid")
        # TODO: check project ownership!!!
        output = subprocess.check_output(['python', GEN_COMPONENT_SCRIPT, project_id, prompt, self.id])
        safrs.log.info(f"Generated component {output}")
        return BaseModel.__init__(self, *args, **kwargs)
    
    @jsonapi_attr
    def project_id(self):
        return "project_id"
    
    @jsonapi_attr
    def tsx_path(self):
        return f"{ULID_ROOT}/{self.project_id}/ui/spa/gen_components/{self.id}/HighLight.tsx"


# TODO, move this to a separate file
engine = create_engine("sqlite:///" + str(Path(__file__).parent) + "/db.sqlite")
with engine.connect() as connection:
    Base.metadata.create_all(engine)
